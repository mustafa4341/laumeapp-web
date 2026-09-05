import { DEFAULT_LOCALE, type Locale } from "../config";
import tr from "./tr";
import en from "./en";

/**
 * Sözlük şekli referans dilden (Türkçe) türetilir. `tr.ts`'e eklenen her
 * anahtar diğer dillerde zorunlu hâle gelir; eksik çeviri derleme hatasıdır.
 */
export type Dictionary = typeof tr;

/**
 * Yeni dil eklerken burada tek satır: `{ tr, en, de }`.
 * `Record<Locale, Dictionary>` olduğu için `config.ts`'e eklenip buraya
 * eklenmeyen bir dil de derlemede yakalanır.
 */
const DICTIONARIES: Record<Locale, Dictionary> = { tr, en };

/**
 * İstemci bileşenleri de bunu kullanır; bu yüzden modül `next` bağımlılığı
 * taşımaz (metadata yardımcıları `lib/i18n/index.ts` içinde durur).
 */
export function getDictionary(locale: Locale): Dictionary {
  return DICTIONARIES[locale] ?? DICTIONARIES[DEFAULT_LOCALE];
}
