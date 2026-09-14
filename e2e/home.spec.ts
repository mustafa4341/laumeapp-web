import { expect, test } from "@playwright/test";

test.describe("Laume ana sayfası — mobil", () => {
  test.use({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });

  test("ana sayfa taşmadan okunur; hikâye ve indirme çağrısı erişilebilirdir", async ({ page }) => {
    await page.goto("/home");

    await expect(page.getByRole("heading", { name: "Bir mektup seni bekliyor." })).toBeVisible();
    await expect(page.getByRole("link", { name: "Nasıl çalıştığını gör" })).toBeVisible();
    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(390);

    await page.locator("#muhurler").scrollIntoViewIfNeeded();
    await expect(page.getByRole("heading", { name: "Haritadaki her mühür başka çalışır." })).toBeVisible();
    await expect(page.getByRole("heading", { name: "Zaman Kapsülü" })).toBeVisible();

    await page.locator("#indir").scrollIntoViewIfNeeded();
    await expect(page.getByRole("heading", { name: "İlk mektup yakınında olabilir." })).toBeVisible();
  });
});

test.describe("Laume ana sayfası — bağlantılar ve görseller", () => {
  test("tablet-mobil genişlikte şehir görselleri tam oranında ve kısa görünür", async ({ page }) => {
    await page.setViewportSize({ width: 687, height: 860 });
    await page.goto("/home");

    for (const id of ["#ana-nokta", "#zaman-kapsulu"]) {
      const section = page.locator(id);
      const image = section.locator("img");
      await section.scrollIntoViewIfNeeded();
      const sectionBox = await section.boundingBox();
      const imageBox = await image.boundingBox();
      expect(sectionBox).not.toBeNull();
      expect(imageBox).not.toBeNull();
      expect(imageBox!.width / imageBox!.height).toBeCloseTo(16 / 9, 1);
      expect(sectionBox!.height).toBeLessThan(720);
    }

    await expect.poll(() => page.evaluate(() => document.documentElement.scrollWidth)).toBe(687);
  });

  test("tüm yerel bağlantılar çalışır ve görseller eksiksiz yüklenir", async ({ page, request, baseURL }) => {
    test.setTimeout(120_000);
    await page.goto("/home");

    const images = page.locator("img");
    for (let index = 0; index < await images.count(); index += 1) {
      await images.nth(index).scrollIntoViewIfNeeded();
    }
    await expect.poll(async () =>
      images.evaluateAll((nodes) => nodes.every((node) => (node as HTMLImageElement).complete && (node as HTMLImageElement).naturalWidth > 0))
    ).toBe(true);

    const hrefs = await page.locator("a[href]").evaluateAll((nodes) =>
      [...new Set(nodes.map((node) => (node as HTMLAnchorElement).getAttribute("href") ?? ""))]
        .filter((href) => href.startsWith("/") && !href.startsWith("//"))
    );

    for (const href of hrefs) {
      const response = await request.get(new URL(href, baseURL).toString());
      expect(response.status(), `${href} çalışmıyor`).toBeLessThan(400);
    }
  });

  test("yeniden oynatma ritüele, indirme çağrısı indirme sayfasına gider", async ({ page }) => {
    await page.goto("/home");
    await expect(page.getByRole("link", { name: "Giriş ritüelini yeniden yaşa →" })).toHaveAttribute("href", "/?replay=1");
    await expect(page.getByRole("link", { name: "İndirme sayfasına git" })).toHaveAttribute("href", "/download");
  });
});
