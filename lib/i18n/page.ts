import { DEFAULT_LOCALE, isLocale, type Locale } from "./config";

/**
 * Her sayfa dosyasında tekrar eden `params` çözümlemesini tek yere alır.
 * Geçersiz bir dil kodu 404 yerine varsayılan dile düşer: URL elle yazılmış
 * olabilir ve boş sayfa göstermek ziyaretçiyi kaybetmenin en hızlı yoludur.
 */
export type LocaleParams = { params: Promise<{ locale: string }> };

export async function resolveLocale(params: LocaleParams["params"]): Promise<Locale> {
  const { locale } = await params;
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}
