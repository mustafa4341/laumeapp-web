import type { Metadata } from "next";
import { appConfig } from "@/lib/config";
import { DEFAULT_LOCALE, LOCALES, LOCALE_META, type Locale, localeHref } from "./config";
import { getDictionary } from "./dictionaries";

/**
 * ÇOK DİLLİLİK — TEK GİRİŞ NOKTASI
 *
 * Sunucu tarafı her şeyi buradan alır: sözlük, canonical/hreflang, metadata ve
 * yapısal veri. İstemci bileşenleri yalnız `./config` ve `./dictionaries`
 * kullanır (bu dosya `next` tiplerine bağımlıdır).
 */
export * from "./config";
export * from "./dictionaries";
export * from "./page";

export const SITE_URL = "https://laumeapp.com";
export const SUPPORT_EMAIL = "destek@laumeapp.com";

/**
 * Mağaza bağlantıları. Yayında olmayan mağaza `null` kalır — uydurma link yok.
 *
 * ⚠ TEK KAYNAK `lib/config.ts`'tir. Bu adres bir zamanlar burada AYRICA sabit
 * kodlanmıştı; `appConfig` "yayında değil"e çevrildiğinde bu kopya eski
 * değerde kalıyor, hem `/download` sayfası hem yapısal verideki `installUrl`
 * ziyaretçiyi (ve Google'ı) 404'e göndermeye devam ediyordu. Aynı gerçeğin
 * iki yerde yaşamasının maliyeti tam olarak budur.
 */
export const STORES = {
  googlePlay:
    appConfig.stores.googlePlay.status === "active" ? appConfig.stores.googlePlay.url : null,
  appStore: appConfig.stores.appStore.status === "active" ? appConfig.stores.appStore.url : null,
};

/**
 * Bir sayfanın hreflang kümesi.
 *
 * `path` dilden bağımsız yoldur ("/support/faq"). Her dil için mutlak URL
 * üretilir, `x-default` varsayılan dile işaret eder. Google, bir sayfanın
 * çevirilerini ancak karşılıklı (her sayfa diğerlerini işaret eden) bir
 * hreflang kümesiyle eşleştirir; tek yönlü bildirim yok sayılır.
 */
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
  const languages: Record<string, string> = {};
  for (const l of LOCALES) {
    languages[LOCALE_META[l].hreflang] = `${SITE_URL}${localeHref(l, path)}`;
  }
  languages["x-default"] = `${SITE_URL}${localeHref(DEFAULT_LOCALE, path)}`;

  return {
    canonical: `${SITE_URL}${localeHref(locale, path)}`,
    languages,
  };
}

/**
 * Sayfa metadata'sı için tek giriş noktası. Başlık/açıklama sözlükten gelir,
 * canonical ve hreflang otomatik hesaplanır — sayfa dosyalarında elle URL
 * yazılmaz, yoksa yeni dil eklendiğinde geride kalırlar.
 */
export function buildMetadata(opts: {
  locale: Locale;
  path: string;
  title: string;
  description: string;
  /** Ana sayfada başlık şablonu uygulanmaz. */
  absoluteTitle?: boolean;
}): Metadata {
  const dict = getDictionary(opts.locale);
  const meta = LOCALE_META[opts.locale];

  return {
    title: opts.absoluteTitle ? { absolute: opts.title } : opts.title,
    description: opts.description,
    alternates: alternatesFor(opts.locale, opts.path),
    openGraph: {
      type: "website",
      locale: meta.ogLocale,
      url: `${SITE_URL}${localeHref(opts.locale, opts.path)}`,
      siteName: dict.seo.siteName,
      title: opts.title,
      description: opts.description,
    },
    twitter: {
      card: "summary_large_image",
      title: opts.title,
      description: opts.description,
    },
  };
}

/**
 * schema.org grafiği, sayfanın dilinde.
 *
 * Bilinçli olarak yok: `aggregateRating`, `sameAs`, indirme sayısı.
 * Doğrulanmamış yapısal veri zengin sonuç cezası riskidir; gerçek sosyal
 * hesaplar ve gerçek puanlar oluştuğunda eklenir.
 */
export function buildJsonLd(locale: Locale) {
  const dict = getDictionary(locale);
  const meta = LOCALE_META[locale];
  const home = `${SITE_URL}${localeHref(locale, "/")}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${SITE_URL}/#organization`,
        name: dict.seo.siteName,
        url: SITE_URL,
        logo: { "@type": "ImageObject", url: `${SITE_URL}/icon.png` },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "customer support",
          email: SUPPORT_EMAIL,
          availableLanguage: LOCALES.map((l) => LOCALE_META[l].hreflang),
        },
      },
      {
        "@type": "WebSite",
        "@id": `${home}#website`,
        url: home,
        name: dict.seo.siteName,
        description: dict.seo.description,
        inLanguage: meta.htmlLang,
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
      {
        "@type": "MobileApplication",
        "@id": `${SITE_URL}/#app`,
        name: dict.seo.siteName,
        alternateName: dict.seo.appName,
        description: dict.seo.description,
        url: home,
        inLanguage: meta.htmlLang,
        applicationCategory: "SocialNetworkingApplication",
        applicationSubCategory: "Location-based discovery",
        operatingSystem: "Android 10+, iOS 15+",
        // Mağaza yayında değilken alan HİÇ yazılmaz: `installUrl: null`
        // Google'a "kurulum adresi yok" değil, "bozuk bir adres var" der.
        ...(STORES.googlePlay ? { installUrl: STORES.googlePlay } : {}),
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "TRY",
          category: "free with optional in-app purchases",
        },
        publisher: { "@id": `${SITE_URL}/#organization` },
      },
    ],
  };
}
