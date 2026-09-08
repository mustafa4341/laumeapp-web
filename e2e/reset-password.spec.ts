import { test, expect } from "@playwright/test";

/**
 * Şifre sıfırlama köprüsü + iOS App Link doğrulama dosyası (kaynak: FIX-026).
 *
 * Supabase kurtarma e-postası `https://www.laumeapp.com/reset-password?code=…`
 * adresine döner. Bu adres:
 *   • 404/redirect VEREMEZ — App Link doğrulaması yönlendirme izlemez,
 *   • adres satırındaki `code` parametresini olduğu gibi uygulamaya taşımalı,
 *   • uygulama yoksa/masaüstündeyse kullanıcıyı boş ekranda bırakmamalı.
 */

test.describe("Şifre sıfırlama köprüsü", () => {
  test("/reset-password her dilde 200 döner, redirect değil rewrite", async ({ page }) => {
    for (const url of ["/reset-password", "/en/reset-password"]) {
      const res = await page.goto(url);
      expect(res?.status(), `${url} 200 dönmeli`).toBe(200);
      // Ön eksiz istek içeriden /tr/... adresine REWRITE edilir; tarayıcıdaki
      // adres değişmemeli (redirect olsaydı App Link doğrulaması kırılırdı).
      expect(new URL(page.url()).pathname).toBe(url);
    }
  });

  test("adres satırındaki code parametresi uygulama bağlantısına taşınır", async ({ page }) => {
    await page.goto("/reset-password?code=abc123&type=recovery");

    const openInApp = page.getByTestId("btn-open-app");
    await expect(openInApp).toHaveAttribute(
      "href",
      /^layar:\/\/reset-password\?code=abc123&type=recovery$/
    );
  });

  test("kod yoksa kullanıcı uyarılır ama sayfa yine açılır", async ({ page }) => {
    await page.goto("/reset-password");
    await expect(page.getByTestId("missing-code-note")).toBeVisible();
    await expect(page.getByTestId("btn-download-fallback")).toBeVisible();
  });

  test("İngilizce köprüde iç bağlantı dili korur", async ({ page }) => {
    await page.goto("/en/reset-password");
    await expect(page.getByTestId("btn-download-fallback")).toHaveAttribute(
      "href",
      "/en/download"
    );
  });

  test("görünür metinde Layar kalıntısı yok", async ({ page }) => {
    await page.goto("/reset-password?code=abc123");
    await expect(page.locator("body")).not.toContainText("Layar");
  });

  test("sayfa indekslenmez", async ({ page }) => {
    await page.goto("/reset-password");
    const robots = await page.locator('meta[name="robots"]').getAttribute("content");
    expect(robots ?? "").toContain("noindex");
  });
});

test.describe("iOS App Link doğrulama dosyası", () => {
  test("apple-app-site-association 200, JSON türünde ve /reset-password yolunu kapsar", async ({
    request,
  }) => {
    const res = await request.get("/.well-known/apple-app-site-association");
    expect(res.status()).toBe(200);
    expect(res.headers()["content-type"]).toContain("application/json");

    // Sitenin 404 HTML'i değil, gerçek JSON dönmeli.
    const body = JSON.parse(await res.text());
    const detail = body.applinks.details[0];
    expect(detail.appID).toContain("app.layar.mobile");
    expect(detail.paths).toContain("/reset-password");
    expect(detail.paths).toContain("/n/*");
  });
});
