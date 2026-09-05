/**
 * ÇOK DİLLİLİK — MERKEZ YAPILANDIRMA
 *
 * Yeni bir dil eklemek için yapılacaklar (tamamı bu üç adım):
 *   1. `lib/i18n/dictionaries/<kod>.ts` dosyasını `tr.ts`'i kopyalayarak oluştur.
 *      Tip `Dictionary` olduğu için eksik bir anahtar derlemede hata verir —
 *      çeviri sessizce yarım kalamaz.
 *   2. Aşağıdaki `LOCALES` dizisine ve `LOCALE_META` tablosuna kodu ekle.
 *   3. `lib/i18n/index.ts` içindeki `DICTIONARIES` haritasına import et.
 * Yönlendirme, hreflang, sitemap ve dil değiştirici kendiliğinden güncellenir.
 */

export const LOCALES = ["tr", "en"] as const;

export type Locale = (typeof LOCALES)[number];

/**
 * Varsayılan dil ÖN EKSİZ sunulur: Türkçe ana sayfa `/`, İngilizce `/en`.
 *
 * Neden: `laumeapp.com/privacy` ve `laumeapp.com/delete-account` adresleri
 * Play Console'a bu hâlleriyle bildirildi. Türkçeyi `/tr/...` altına taşımak
 * o bağlantıları kırar ve mevcut indeks sinyallerini sıfırlar.
 */
export const DEFAULT_LOCALE: Locale = "tr";

export interface LocaleMeta {
  /** Dil değiştiricide görünen ad — her zaman kendi dilinde yazılır. */
  label: string;
  /** `<html lang>` değeri. */
  htmlLang: string;
  /** Open Graph `og:locale`. */
  ogLocale: string;
  /** `hreflang` değeri; bölgesel varyant gerekirse burada ayrışır (ör. "pt-BR"). */
  hreflang: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  tr: { label: "Türkçe", htmlLang: "tr", ogLocale: "tr_TR", hreflang: "tr" },
  en: { label: "English", htmlLang: "en", ogLocale: "en_US", hreflang: "en" },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Bir dilin ön ekini verir. Varsayılan dilde boş string döner — çağıran taraf
 * "varsayılan mı değil mi" diye ayrı bir kontrol yazmak zorunda kalmasın.
 */
export function localePrefix(locale: Locale): string {
  return locale === DEFAULT_LOCALE ? "" : `/${locale}`;
}

/**
 * Dilden bağımsız bir yol ("/support/faq") + dil → gerçek URL.
 * Uygulamadaki TÜM iç bağlantılar bu fonksiyondan geçer; elle `/en/...`
 * yazılmaz, yoksa yeni dil eklendiğinde bağlantılar geride kalır.
 */
export function localeHref(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path.startsWith("/") ? path : `/${path}`;
  const href = `${localePrefix(locale)}${clean}`;
  return href === "" ? "/" : href;
}

/**
 * Bir URL yolundan dili ve dilden bağımsız yolu ayırır.
 * "/en/support" → { locale: "en", path: "/support" }
 * "/support"    → { locale: "tr", path: "/support" }
 */
export function splitLocale(pathname: string): { locale: Locale; path: string } {
  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];
  if (first && isLocale(first) && first !== DEFAULT_LOCALE) {
    const rest = `/${segments.slice(1).join("/")}`;
    return { locale: first, path: rest === "/" ? "/" : rest.replace(/\/$/, "") };
  }
  return { locale: DEFAULT_LOCALE, path: pathname === "" ? "/" : pathname };
}
