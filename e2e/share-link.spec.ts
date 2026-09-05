import { test, expect } from "@playwright/test";

/**
 * PAYLAŞIM LİNKİ SÖZLEŞMESİ
 *
 * Uygulamanın ürettiği adres (layar deposu `shared/utils/layarUrl.ts`):
 *   https://laumeapp.com/n/<uuid>?ref=<kod>
 *
 * Buradaki kimlik BİLEREK gerçek bir UUID biçimindedir: bu testlerin var olma
 * sebebi, iki rotanın da bir zamanlar `{3,32}` uzunluk sınırıyla doğrulama
 * yapıp 36 karakterlik her gerçek linki 404'e düşürmesiydi. Kısa/uydurma bir
 * kimlikle test etmek o hatayı bir daha yakalayamaz.
 */
const REAL_ID = "0f9c2a4e-6b1d-4c3a-9f2e-5a7b8c9d0e1f";

test.describe("Paylaşım linki — kimlik sözleşmesi", () => {
  test("uygulamanın paylaştığı UUID biçimi 404 vermez", async ({ request }) => {
    for (const url of [`/n/${REAL_ID}`, `/letters/${REAL_ID}`, `/en/n/${REAL_ID}`]) {
      const res = await request.get(url);
      expect(res.status(), `${url} 200 dönmeli`).toBe(200);
    }
  });

  test("bozuk kimlikler 404 döner", async ({ request }) => {
    // Sırasıyla: çok kısa · UUID olmayan metin · tire sayısı bozuk · sürüm hanesi geçersiz
    const broken = ["abc", "hello-world", "0f9c2a4e6b1d4c3a9f2e5a7b8c9d0e1f", "0f9c2a4e-6b1d-9c3a-9f2e-5a7b8c9d0e1f"];
    for (const id of broken) {
      const res = await request.get(`/n/${id}`);
      expect(res.status(), `/n/${id} 404 dönmeli`).toBe(404);
    }
  });

  test("paylaşılan adres sosyal önizleme etiketlerini SUNUCUDA üretir", async ({ request }) => {
    // Önizleme robotları JavaScript çalıştırmaz: etiketler ilk HTML yanıtında
    // olmak zorunda. `page.goto` yerine ham istek kullanmamızın sebebi bu.
    const html = await (await request.get(`/n/${REAL_ID}`)).text();

    for (const property of ["og:title", "og:description", "og:url", "og:site_name"]) {
      expect(html, `${property} ilk HTML yanıtında olmalı`).toContain(`property="${property}"`);
    }
    expect(html).toContain('name="twitter:card"');
    expect(html).toContain(`https://laumeapp.com/n/${REAL_ID}`);
  });

  test("veri yokken sayfa 'mektup yok' iddiasında BULUNMAZ", async ({ page }) => {
    // Ortam bağlı değilken (veya 0160 uygulanmadan) sunucu cevap veremez.
    // Bilinmeyeni yokluk gibi göstermek yasak — CLAUDE.md kural 2/7.
    await page.goto(`/n/${REAL_ID}`);
    const body = (await page.locator("body").innerText()).toLowerCase();
    for (const claim of ["artık burada değil", "bulunamadı", "no longer here", "not found"]) {
      expect(body, `"${claim}" iddiası veri yokken gösterilemez`).not.toContain(claim);
    }
  });

  test("derin bağlantı uygulamanın tanıdığı biçimdedir ve atıf kodunu korur", async ({ page }) => {
    // `layar://letter/<id>` uygulamanın ayrıştırıcısında HİÇBİR dala düşmez;
    // yalnız `n` (veya `note`) segmenti tanınır. Bu test o regresyonu kilitler.
    await page.goto(`/n/${REAL_ID}?ref=ABC123`);
    const href = await page.getByTestId("btn-open-app").getAttribute("href");

    expect(href).toBe(`layar://n/${REAL_ID}?ref=ABC123`);
    expect(href).not.toContain("layar://letter/");
  });

  test("geçersiz atıf kodu derin bağlantıya taşınmaz", async ({ page }) => {
    await page.goto(`/n/${REAL_ID}?ref=${encodeURIComponent("bad code!<>")}`);
    const href = await page.getByTestId("btn-open-app").getAttribute("href");

    expect(href).toBe(`layar://n/${REAL_ID}`);
  });

  test("assetlinks.json tam olarak beklenen adreste ve doğru pakette", async ({ request }) => {
    // Android bu adresi HARFİYEN arar; tek karakter sapma doğrulamayı düşürür.
    const res = await request.get("/.well-known/assetlinks.json");
    expect(res.status()).toBe(200);

    const statements = JSON.parse(await res.text());
    expect(Array.isArray(statements)).toBe(true);
    expect(statements[0].relation).toContain("delegate_permission/common.handle_all_urls");
    expect(statements[0].target.package_name).toBe("app.layar.mobile");
    expect(statements[0].target.namespace).toBe("android_app");
  });

  test("paylaşım sayfası mektup gövdesini veya koordinatı asla taşımaz", async ({ page }) => {
    await page.goto(`/n/${REAL_ID}`);
    const html = (await page.content()).toLowerCase();

    // Gizlilik sınırı: sunucudan yalnız başlık + bölge adı gelir. Gövde,
    // koordinat ve yazar kimliği bu sayfaya hiçbir koşulda girmez.
    for (const forbidden of ["latitude", "longitude", '"lat"', '"lng"', "body:", "author_id"]) {
      expect(html, `${forbidden} sayfada görünmemeli`).not.toContain(forbidden);
    }
  });
});
