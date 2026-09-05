import type { MetadataRoute } from "next";
import { LOCALES, LOCALE_META, SITE_URL, localeHref } from "@/lib/i18n";

/**
 * `lastModified` bilinçli olarak SABİT bir tarih.
 *
 * Önceki sürüm `new Date()` kullanıyordu: her build'de tüm sayfalar "az önce
 * güncellendi" diye bildiriliyordu. İçerik değişmediği hâlde verilen bu sinyal
 * zamanla güvenilmez sayılır ve tarama bütçesini boşa harcar. İçerik gerçekten
 * değiştiğinde bu tarih elle güncellenir.
 */
const LAST_CONTENT_UPDATE = new Date("2026-09-05");

type Entry = {
  /** Dilden bağımsız yol; her dil için ayrı URL üretilir. */
  path: string;
  priority: number;
  changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"];
};

const ROUTES: Entry[] = [
  { path: "/", priority: 1.0, changeFrequency: "monthly" },
  { path: "/home", priority: 0.9, changeFrequency: "monthly" },
  { path: "/download", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/support", priority: 0.7, changeFrequency: "monthly" },
  { path: "/support/faq", priority: 0.8, changeFrequency: "monthly" },
  { path: "/support/contact", priority: 0.6, changeFrequency: "yearly" },
  { path: "/legal", priority: 0.4, changeFrequency: "yearly" },
  { path: "/legal/privacy", priority: 0.5, changeFrequency: "yearly" },
  { path: "/legal/terms", priority: 0.4, changeFrequency: "yearly" },
  { path: "/legal/community-guidelines", priority: 0.4, changeFrequency: "yearly" },
  { path: "/legal/cookies", priority: 0.3, changeFrequency: "yearly" },
  { path: "/legal/refunds", priority: 0.3, changeFrequency: "yearly" },
];

/**
 * Her sayfa her dilde listelenir ve kendi `alternates` bloğunu taşır.
 * Google, çevirileri ancak karşılıklı bildirimle eşleştirir; sitemap'teki
 * `xhtml:link` kümesi bunun en sağlam yoludur (sayfa etiketiyle birlikte).
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return ROUTES.flatMap((route) =>
    LOCALES.map((locale) => ({
      url: `${SITE_URL}${localeHref(locale, route.path)}`,
      lastModified: LAST_CONTENT_UPDATE,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: Object.fromEntries(
          LOCALES.map((l) => [
            LOCALE_META[l].hreflang,
            `${SITE_URL}${localeHref(l, route.path)}`,
          ])
        ),
      },
    }))
  );
}
