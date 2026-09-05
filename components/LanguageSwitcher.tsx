"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALES, LOCALE_META, localeHref, splitLocale, type Locale } from "@/lib/i18n/config";

/**
 * Dil değiştirici.
 *
 * Kritik nokta: her seçenek, **bulunduğun sayfanın** diğer dildeki karşılığına
 * gider — ana sayfaya değil. Dil değiştirince içeriği kaybetmek, çok dilli
 * sitelerde en sık yapılan hatadır ve kullanıcıyı da tarayıcıyı da yanıltır.
 *
 * `LOCALES` dizisinden üretilir; yeni dil eklendiğinde burada iş yoktur.
 */
export function LanguageSwitcher({ locale, label }: { locale: Locale; label: string }) {
  const pathname = usePathname() ?? "/";
  const { path } = splitLocale(pathname);

  return (
    <nav
      aria-label={label}
      data-testid="language-switcher"
      style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
    >
      {LOCALES.map((l) => {
        const active = l === locale;
        return (
          <Link
            key={l}
            href={localeHref(l, path)}
            hrefLang={LOCALE_META[l].hreflang}
            aria-current={active ? "true" : undefined}
            className="link-nav"
            style={{
              fontSize: "var(--text-xs)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              opacity: active ? 1 : 0.55,
              fontWeight: active ? 600 : 400,
            }}
          >
            {l}
          </Link>
        );
      })}
    </nav>
  );
}
