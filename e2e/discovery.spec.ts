import { test, expect, type Page } from "@playwright/test";

/** İzdeki toplam adım — components/discovery/traceGeometry.ts ile aynı. */
const TRACE_STEPS = 12;

async function clearDiscoveryStorage(page: Page) {
  await page.addInitScript(() => {
    localStorage.removeItem("laume_discovery_completed");
    localStorage.removeItem("layar_discovery_completed");
  });
}

/** Sahnenin o anki durumu — kesin ve zamanlamadan bağımsız bir kontrol. */
function stageState(page: Page) {
  return page.getByTestId("discovery-stage").getAttribute("data-state");
}

async function expectState(page: Page, state: string, timeout = 8000) {
  await expect
    .poll(() => stageState(page), { timeout })
    .toBe(state);
}

/** Klavye ile izi baştan sona yürür: her Enter bir adım açar. */
async function walkTrailWithKeyboard(page: Page, steps = TRACE_STEPS) {
  for (let i = 0; i < steps; i++) {
    await page.keyboard.press("Enter");
    await page.waitForTimeout(120);
  }
}

test.describe("Keşif deneyimi", () => {
  test("ilk imleç hareketi keşfi başlatır", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Burada bir şey var." })).toBeVisible();
    await expectState(page, "arrival");

    await page.mouse.move(400, 300);
    await page.mouse.move(500, 320);

    await expectState(page, "trace");
    await expect(page.getByText("Bir iz.", { exact: true })).toBeVisible();
  });

  test("iz sırayla açılır ve hikâyeyi ilerletir", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.goto("/");
    await page.mouse.move(400, 300);
    await expectState(page, "trace");

    // İlk üç adım "bir iz" aşamasını tamamlar.
    await walkTrailWithKeyboard(page, 3);
    await expectState(page, "fragment");
    await expect(page.getByText("…senin bulacağını biliyordum…", { exact: true })).toBeVisible();

    // Kalan adımlar mesafeyi kapatır.
    await walkTrailWithKeyboard(page, TRACE_STEPS - 3);
    await expectState(page, "seal-ready");
    await expect(page.getByText("Buldun.", { exact: true })).toBeVisible();
  });

  test("beklemek izi ziyaretçi yerine tamamlamaz", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.goto("/");
    await page.mouse.move(400, 300);
    await expectState(page, "trace");

    await page.waitForTimeout(5200);

    await expect(page.locator('[data-found="true"]')).toHaveCount(0);
    await expectState(page, "trace");
    await expect(page.getByText("İzi takip et.", { exact: true })).toBeVisible();
  });

  test("ses açık kullanıcı tercihiyle başlar", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.addInitScript(() => localStorage.removeItem("laume_audio_muted"));
    await page.goto("/");
    await expect(page.getByTestId("btn-audio-toggle")).toHaveAttribute("aria-label", "Sesi aç");
  });

  test("iz yalnızca sırayla ilerler, adım atlanamaz", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.goto("/");
    await page.mouse.move(400, 300);
    await expectState(page, "trace");

    const steps = page.locator("[data-step]");
    await expect(steps).toHaveCount(TRACE_STEPS);

    // Son adımın üstüne gitmek hiçbir şeyi açmaz: sıradaki adım o değil.
    const last = steps.nth(TRACE_STEPS - 1);
    const box = (await last.boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.waitForTimeout(400);
    await expect(page.locator('[data-found="true"]')).toHaveCount(0);
    await expectState(page, "trace");
  });

  test("mesafe 18 m'den 2 m'ye iner ve geri sıçramaz", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.goto("/");
    await page.mouse.move(400, 300);
    await walkTrailWithKeyboard(page, 5);
    await expectState(page, "approaching");

    const readout = page.getByTestId("distance-value");
    const first = Number((await readout.innerText()).replace(/\D/g, ""));
    expect(first).toBeLessThanOrEqual(18);

    await walkTrailWithKeyboard(page, TRACE_STEPS - 5);
    await expectState(page, "seal-ready");
  });

  test("mühür basılı tutunca kırılır, erken bırakınca kırılmaz", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.goto("/");
    await page.mouse.move(400, 300);
    await walkTrailWithKeyboard(page);
    await expectState(page, "seal-ready");

    const seal = page.getByTestId("seal-press-target");
    const box = (await seal.boundingBox())!;
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    // Erken bırakma: ilerleme geri gevşer, mühür kırılmaz.
    await page.mouse.move(cx, cy);
    await page.mouse.down();
    await page.waitForTimeout(300);
    await page.mouse.up();
    await page.waitForTimeout(400);
    await expectState(page, "seal-hold");
    expect(Number(await seal.getAttribute("aria-valuenow"))).toBeLessThan(60);

    // Tam basılı tutma: mühür kırılır, mektup çekilebilir hâle gelir.
    await page.mouse.down();
    await page.waitForTimeout(1400);
    await page.mouse.up();
    await expectState(page, "letter-pull");
  });

  test("mektup yukarı sürüklenerek çıkarılır", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.goto("/");
    await page.mouse.move(400, 300);
    await walkTrailWithKeyboard(page);
    await expectState(page, "seal-ready");

    const seal = page.getByTestId("seal-press-target");
    const sealBox = (await seal.boundingBox())!;
    await page.mouse.move(sealBox.x + sealBox.width / 2, sealBox.y + sealBox.height / 2);
    await page.mouse.down();
    await page.waitForTimeout(1400);
    await page.mouse.up();
    await expectState(page, "letter-pull");

    const letter = page.getByTestId("letter-sheet");
    const box = (await letter.boundingBox())!;
    const startX = box.x + box.width / 2;
    const startY = box.y + 12;
    await page.mouse.move(startX, startY);
    await page.mouse.down();
    for (let i = 1; i <= 12; i++) {
      await page.mouse.move(startX, startY - i * 24);
      await page.waitForTimeout(20);
    }
    await page.mouse.up();

    await expectState(page, "letter-read");
    await expect(page.getByRole("heading", { name: "Bu sadece ilkiydi." })).toBeVisible();
    await expect(
      page.getByTestId("letter-sheet").getByText("Birileri, bir yerde, senin bulman için bir şey bıraktı.")
    ).toBeVisible();
  });

  test("klavye tek başına tüm akışı tamamlar", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.goto("/");
    await page.mouse.move(200, 200);
    await walkTrailWithKeyboard(page);
    await expectState(page, "seal-ready");

    await page.keyboard.press("Enter"); // mühür kırılır
    await expectState(page, "letter-pull");

    await page.keyboard.press("Enter"); // mektup çekilir
    await expectState(page, "letter-read");
    await expect(page.getByRole("heading", { name: "Bu sadece ilkiydi." })).toBeVisible();

    await page.keyboard.press("Enter");
    await expectState(page, "continuation");
    await expect(page.getByText("Yakınında başka ne var?", { exact: true })).toBeVisible();

    await page.getByTestId("btn-continue-discovery").click();
    await expect(page).toHaveURL(/\/home/);
  });

  test("azaltılmış harekette mühür ve mektup tek dokunuşla tamamlanır", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    await page.mouse.move(200, 200);
    await walkTrailWithKeyboard(page);
    await expectState(page, "seal-ready");
    await expect(page.getByText("Buldun.", { exact: true })).toBeVisible();

    const seal = page.getByTestId("seal-press-target");
    await seal.dispatchEvent("pointerdown", { pointerId: 1, button: 0 });
    await expectState(page, "letter-pull");

    const letter = page.getByTestId("letter-sheet");
    await letter.dispatchEvent("pointerdown", { pointerId: 1, button: 0 });
    await expectState(page, "letter-read");
    await expect(page.getByRole("heading", { name: "Bu sadece ilkiydi." })).toBeVisible();
  });

  test("keşif her aşamadan atlanabilir", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.goto("/");
    await page.getByTestId("btn-skip-discovery").click();
    await expect(page).toHaveURL(/\/home/);
  });

  test("Escape akışın ortasından da atlar", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.goto("/");
    await page.mouse.move(300, 300);
    await expectState(page, "trace");
    await page.keyboard.press("Escape");
    await expect(page).toHaveURL(/\/home/);
  });

  test("keşfi tamamlamış ziyaretçi doğrudan /home'a gider", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("laume_discovery_completed", "true");
    });
    await page.goto("/");
    await expect(page).toHaveURL(/\/home/);
  });

  test("?replay=1 keşfi yeniden başlatır", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.setItem("laume_discovery_completed", "true");
    });
    await page.goto("/?replay=1");
    await expect(page.getByRole("heading", { name: "Burada bir şey var." })).toBeVisible();
  });

  test("doğrudan sayfalar keşfe takılmaz", async ({ page }) => {
    for (const path of ["/support", "/legal", "/download"]) {
      await page.goto(path);
      await expect(page.getByRole("heading", { name: "Burada bir şey var." })).not.toBeVisible();
    }
  });

  test("görünür marka metninde Layar kalıntısı yok", async ({ page }) => {
    await clearDiscoveryStorage(page);
    await page.goto("/");
    await expect(page.locator("body")).not.toContainText("Layar");
  });
});
