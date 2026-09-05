import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/i18n";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // `/n/*` derin bağlantı köprüleri BİLEREK taramaya açık bırakıldı.
        // Önceki sürüm bunları `disallow` ediyordu; bu bir hataydı: taraması
        // engellenen bir sayfanın `noindex` etiketi hiç okunmaz, dolayısıyla
        // dışarıdan link geldiğinde sayfa yine de (başlıksız olarak) indekslenir.
        // Doğru yöntem: taramaya izin ver, indekslemeyi sayfanın kendi
        // `robots: { index: false }` metadata'sıyla engelle (app/n/[id]/page.tsx).
        disallow: ["/icon-generator.html"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
