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
