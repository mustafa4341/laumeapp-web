import { test, expect, type Page } from "@playwright/test";

/**
 * MAĞAZA ROZETLERİ + BEKLEME LİSTESİ SÖZLEŞMESİ
 *
 * Ağa çıkan yazma yolu (`/api/waitlist` → Supabase) bu testlerde HİÇ
 * çalıştırılmaz: başarı/arıza senaryoları `page.route` ile taklit edilir,
 * doğrudan API testleri ise yalnız sunucu doğrulamasının reddettiği (ağa hiç
 * çıkmayan) istekleri gönderir. Böylece test koşusu canlı listeye kayıt yazmaz.
 */

async function freshDiscovery(page: Page, path = "/") {
  await page.addInitScript(() => {
    localStorage.removeItem("laume_discovery_completed");
    localStorage.removeItem("layar_discovery_completed");
    // Ölçüm izni banner'ı (GA yapılandırılmışsa) alt kenarı kaplar; burada
    // test edilen şey rozetler, banner değil.
    localStorage.setItem("laume_analytics_consent", "denied");
  });
  await page.goto(path);
}

function stageState(page: Page) {
  return page.getByTestId("discovery-stage").getAttribute("data-state");
}

test.describe("Mağaza rozetleri — keşif sahnesi", () => {
  test("rozetler ilk ekranda görünür ve yayında olmayan mağazaya link vermez", async ({ page }) => {
    await freshDiscovery(page);
    const dock = page.getByTestId("get-app-dock");
    await expect(dock.getByTestId("store-badge-ios")).toBeVisible();
    await expect(dock.getByTestId("store-badge-android")).toBeVisible();
    // CLAUDE.md kural 2: yayında olmayan mağaza linki yok.
    await expect(page.locator('a[href*="apps.apple.com"], a[href*="play.google.com"]')).toHaveCount(0);
    await expect(dock.getByTestId("store-badge-ios")).toHaveAttribute("data-status", "soon");
  });

  test("rozet bekleme formunu açar; Escape formu kapatır, keşfi değil", async ({ page }) => {
    await freshDiscovery(page);
    await page.getByTestId("get-app-dock").getByTestId("store-badge-ios").click();

    const sheet = page.getByTestId("waitlist-sheet").first();
    await expect(sheet).toBeVisible();
    await expect(sheet.getByRole("heading", { name: "Laume çıktığında sana yazalım." })).toBeVisible();
    await expect(sheet.getByRole("radio", { name: "iPhone" })).toBeChecked();

    await page.keyboard.press("Escape");
    await expect(sheet).not.toBeVisible();
    await expect(page).not.toHaveURL(/\/home/);
    expect(await stageState(page)).not.toBe("skipped");
  });

  test("rozetin üzerinde Enter keşfi ilerletmez", async ({ page }) => {
    await freshDiscovery(page);
    await page.getByTestId("get-app-dock").getByTestId("store-badge-android").focus();
    await page.keyboard.press("Enter");
    await expect(page.getByTestId("waitlist-sheet").first()).toBeVisible();
    expect(await stageState(page)).toBe("arrival");
  });

  test("eksik form ağa çıkmadan alan hatası gösterir", async ({ page }) => {
    let posted = false;
    await page.route("**/api/waitlist", (route) => {
      posted = true;
      return route.fulfill({ status: 200, json: { ok: true } });
    });
    await freshDiscovery(page);
    await page.getByTestId("get-app-dock").getByTestId("store-badge-ios").click();
    const sheet = page.getByTestId("waitlist-sheet").first();

    await sheet.getByRole("button", { name: "Haber ver" }).click();
    await expect(sheet.getByTestId("waitlist-error")).toHaveText("Geçerli bir e-posta adresi yaz.");

    await sheet.getByLabel("E-posta", { exact: true }).fill("deneme@example.com");
    await sheet.getByLabel("Şehir", { exact: true }).fill("İstanbul");
    await sheet.getByRole("button", { name: "Haber ver" }).click();
    await expect(sheet.getByTestId("waitlist-error")).toHaveText(
      "Devam etmek için izin kutusunu işaretle."
    );
    expect(posted).toBe(false);
  });

  test("gönderim izinleri ve kanalı taşır, başarı mesajı gösterir", async ({ page }) => {
    let body: Record<string, unknown> | null = null;
    await page.route("**/api/waitlist", async (route) => {
      body = route.request().postDataJSON();
      await route.fulfill({ status: 200, json: { ok: true } });
    });
    await freshDiscovery(page, "/?ref=karakoy-qr");
    await page.getByTestId("get-app-dock").getByTestId("store-badge-android").click();
    const sheet = page.getByTestId("waitlist-sheet").first();

    await sheet.getByLabel("E-posta", { exact: true }).fill("Deneme@Example.com");
    await sheet.getByLabel("Şehir", { exact: true }).fill("İstanbul");
    await sheet.getByLabel("Bu adrese yalnız bu konuda e-posta gönderilmesine izin veriyorum.").check();
    await sheet.getByRole("button", { name: "Haber ver" }).click();

    await expect(sheet.getByTestId("waitlist-success")).toContainText("Kaydını aldık.");
    expect(body).toMatchObject({
      platform: "android",
      intent: "launch",
      locale: "tr",
      consent: true,
      marketing: false,
      source: "karakoy-qr",
    });
  });

  test("sunucu arızasında dürüst hata ve doğrudan e-posta yolu", async ({ page }) => {
    await page.route("**/api/waitlist", (route) =>
      route.fulfill({ status: 503, json: { ok: false, error: "rpc_missing" } })
    );
    await freshDiscovery(page);
    await page.getByTestId("get-app-dock").getByTestId("store-badge-ios").click();
    const sheet = page.getByTestId("waitlist-sheet").first();
    await sheet.getByLabel("E-posta", { exact: true }).fill("deneme@example.com");
    await sheet.getByLabel("Şehir", { exact: true }).fill("Ankara");
    await sheet.getByLabel("Bu adrese yalnız bu konuda e-posta gönderilmesine izin veriyorum.").check();
    await sheet.getByRole("button", { name: "Haber ver" }).click();

    const error = sheet.getByTestId("waitlist-error");
    await expect(error).toContainText("Şu an kaydedemedik.");
    await expect(error.getByRole("link")).toHaveAttribute("href", /^mailto:destek@laumeapp\.com/);
  });

  test("İngilizce keşiften çıkış İngilizce ana sayfaya gider", async ({ page }) => {
    await freshDiscovery(page, "/en");
    await page.getByTestId("btn-skip-discovery").click();
    // Dev modunda /en/home ilk istekte derlenir; 5 sn varsayılanı yetmiyor.
    await expect(page).toHaveURL(/\/en\/home$/, { timeout: 15_000 });
  });
});

test.describe("Mağaza rozetleri — sayfalar ve API", () => {
  test("/download rozetleri ve durum notunu gösterir", async ({ page }) => {
    await page.addInitScript(() => localStorage.setItem("laume_analytics_consent", "denied"));
    await page.goto("/download");
    const panel = page.getByTestId("get-app-panel");
    await expect(panel.getByTestId("store-badge-ios")).toBeVisible();
    await expect(panel.getByTestId("store-badge-android")).toBeVisible();
    await expect(panel).toContainText("Laume mağazalara çıkmak üzere.");
  });

  test("API geçersiz isteği ağa çıkmadan reddeder", async ({ request }) => {
    const bad = await request.post("/api/waitlist", {
      data: { email: "yok", city: "İstanbul", platform: "ios", intent: "launch", consent: true },
    });
    expect(bad.status()).toBe(400);
    expect(await bad.json()).toEqual({ ok: false, error: "invalid", field: "email" });

    const noConsent = await request.post("/api/waitlist", {
      data: { email: "a@example.com", city: "İstanbul", platform: "ios", intent: "launch" },
    });
    expect(noConsent.status()).toBe(400);
    expect((await noConsent.json()).field).toBe("consent");
  });

  test("API bal küpünü dolduran isteği yazmadan kabul eder", async ({ request }) => {
    const response = await request.post("/api/waitlist", { data: { website: "http://spam" } });
    expect(response.status()).toBe(200);
    expect(await response.json()).toEqual({ ok: true });
  });
});

test.describe("Mağaza rozetleri — mobil", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("rozetler dar ekrana sığar, keşfi geç düğmesiyle çakışmaz", async ({ page }) => {
    await freshDiscovery(page);
    const dock = page.getByTestId("get-app-dock");
    await expect(dock).toBeVisible();
    const box = (await dock.boundingBox())!;
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(390);
    expect(box.y + box.height).toBeLessThanOrEqual(844);

    const skip = (await page.getByTestId("btn-skip-discovery").boundingBox())!;
    const overlaps =
      skip.x < box.x + box.width &&
      skip.x + skip.width > box.x &&
      skip.y < box.y + box.height &&
      skip.y + skip.height > box.y;
    expect(overlaps).toBe(false);
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);
  });
});
