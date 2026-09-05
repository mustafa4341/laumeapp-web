import { test, expect, type Page } from "@playwright/test";

/**
 * Çok dillilik sözleşmesi.
 *
 * Buradaki her test, yeni bir dil eklendiğinde de geçmeli. Sabit dil listesi
 * bilinçli olarak burada tekrarlanıyor: `lib/i18n/config.ts` yanlışlıkla
 * değişirse test bunu yakalasın, sessizce uyum sağlamasın.
 */
const LOCALES = ["tr", "en"] as const;
const DEFAULT_LOCALE = "tr";

/** Dilden bağımsız yol → o dildeki URL. `config.ts` ile aynı kural. */
function href(locale: string, path: string) {
  const prefix = locale === DEFAULT_LOCALE ? "" : `/${locale}`;
  const clean = path === "/" ? "" : path;
  return `${prefix}${clean}` || "/";
}

async function headLinks(page: Page, rel: string) {
  return page.$$eval(`link[rel="${rel}"]`, (nodes) =>
    nodes.map((n) => ({
      href: n.getAttribute("href") ?? "",
      hreflang: n.getAttribute("hreflang") ?? "",
    }))
  );
}

test.describe("Çok dillilik", () => {
  test("varsayılan dil ön eksiz, diğer diller ön ekli sunulur", async ({ page }) => {
    await page.goto("/home");
    await expect(page.locator("html")).toHaveAttribute("lang", "tr");

    await page.goto("/en/home");
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("/tr/* kanonik değildir ve ön eksiz adrese kalıcı olarak taşınır", async ({ page }) => {
    // Aynı içeriğin iki adresi olmamalı: /tr/home ve /home aynı sayfadır.
    const response = await page.goto("/tr/home");
    expect(response?.status()).toBe(200);
    expect(new URL(page.url()).pathname).toBe("/home");
  });

  test("her sayfa kendi dilinde canonical taşır", async ({ page }) => {
    for (const locale of LOCALES) {
      await page.goto(href(locale, "/support/faq"));
      const canonical = await headLinks(page, "canonical");
      expect(canonical).toHaveLength(1);
      expect(canonical[0].href).toBe(
        `https://laumeapp.com${href(locale, "/support/faq")}`
      );
    }
  });

  test("hreflang kümesi karşılıklıdır ve x-default içerir", async ({ page }) => {
    for (const locale of LOCALES) {
      await page.goto(href(locale, "/download"));
      const alts = await headLinks(page, "alternate");
      const map = Object.fromEntries(alts.map((a) => [a.hreflang, a.href]));

      // Tek yönlü hreflang Google tarafından yok sayılır: her dil,
      // diğer TÜM dilleri ve x-default'u bildirmek zorunda.
      for (const other of LOCALES) {
        expect(map[other]).toBe(`https://laumeapp.com${href(other, "/download")}`);
      }
      expect(map["x-default"]).toBe(
        `https://laumeapp.com${href(DEFAULT_LOCALE, "/download")}`
      );
    }
  });

  test("dil değiştirici aynı sayfanın karşılığına gider, ana sayfaya değil", async ({ page }) => {
    await page.goto("/support/faq");
    await page.getByRole("link", { name: "en", exact: true }).click();
    await expect(page).toHaveURL(/\/en\/support\/faq$/);
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
  });

  test("İngilizce sayfadaki iç bağlantılar dili korur", async ({ page }) => {
    await page.goto("/en/support");
    // Dil değiştirici hariç: onun işi zaten diğer dile bağlanmak.
    const hrefs = await page.$$eval("a[href^='/']", (nodes) =>
      nodes
        .filter((n) => !n.closest("[data-testid='language-switcher']"))
        .map((n) => n.getAttribute("href") ?? "")
    );
    // Statik, dilden bağımsız uç noktalar hariç her iç bağlantı /en ile başlamalı.
    const languageAware = hrefs.filter(
      (h) => !h.startsWith("/delete-account") && !h.startsWith("/en")
    );
    expect(languageAware).toEqual([]);
  });

  test("içerik gerçekten çevrilmiştir, Türkçe kalıntı yok", async ({ page }) => {
    await page.goto("/en/home");
    await expect(page.locator("body")).toContainText("A letter belongs to a place.");
    await expect(page.locator("body")).not.toContainText("Bir mektup bir yere aittir");
  });

  test("keşif sahnesi İngilizcede de İngilizce anlatır", async ({ page }) => {
    await page.addInitScript(() => {
      localStorage.removeItem("laume_discovery_completed");
    });
    await page.goto("/en");
    await expect(page.getByRole("heading", { name: "There is something here." })).toBeVisible();
  });

  test("sitemap her sayfayı her dilde ve karşılıklı alternatiflerle listeler", async ({ request }) => {
    const xml = await (await request.get("/sitemap.xml")).text();
    for (const locale of LOCALES) {
      expect(xml).toContain(`<loc>https://laumeapp.com${href(locale, "/support/faq")}</loc>`);
    }
    expect(xml).toContain('hreflang="en"');
    expect(xml).toContain('hreflang="tr"');
  });

  test("Play Console'a bildirilen yasal adresler her dilde 200 döner", async ({ request }) => {
    // Yayın dosyası: "404/redirect/login duvarı = otomatik red".
    for (const url of ["/privacy", "/terms", "/delete-account", "/en/privacy", "/en/terms"]) {
      const res = await request.get(url);
      expect(res.status(), `${url} 200 dönmeli`).toBe(200);
    }
  });

  test("gizlilik takma adı kanonik yasal sayfayı işaret eder", async ({ page }) => {
    await page.goto("/privacy");
    const canonical = await headLinks(page, "canonical");
    expect(canonical[0].href).toBe("https://laumeapp.com/legal/privacy");
  });

  test("SSS yapısal verisi sayfanın dilindedir ve metinle birebir eşleşir", async ({ page }) => {
    await page.goto("/en/support/faq");
    const raw = await page.$$eval('script[type="application/ld+json"]', (nodes) =>
      nodes.map((n) => n.textContent ?? "")
    );
    const faq = raw.map((r) => JSON.parse(r)).find((j) => j["@type"] === "FAQPage");
    expect(faq).toBeTruthy();
    expect(faq.inLanguage).toBe("en");

    // Yapısal veride sayfada görünmeyen bir cevap varsa Google zengin sonucu düşürür.
    for (const entry of faq.mainEntity) {
      await expect(page.locator("body")).toContainText(entry.name);
    }
  });
});
