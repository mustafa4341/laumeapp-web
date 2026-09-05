"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { localeHref, splitLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function Header({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "/";
  const { path } = splitLocale(pathname);
  // Keşif deneyimi kendi chrome'unu yönetir — site header'ı orada gösterilmez.
  if (path === "/") return null;

  const dict = getDictionary(locale);
  const link = (p: string) => localeHref(locale, p);

  return (
    <header
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        backgroundColor: "var(--color-bg-overlay)",
        backdropFilter: "blur(var(--blur-lg))",
        WebkitBackdropFilter: "blur(var(--blur-lg))",
        position: "sticky",
        top: 0,
        zIndex: "var(--z-header)",
      }}
    >
      <div
        className="container"
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-4)",
        }}
      >
        <Link
          href={link("/")}
          className="link-accent"
          style={{
            fontSize: "var(--text-lg)",
            fontWeight: 700,
            letterSpacing: "0.04em",
            display: "flex",
            alignItems: "center",
            gap: "var(--space-2)",
            textDecoration: "none",
            flexShrink: 0,
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              backgroundColor: "var(--color-accent)",
              borderRadius: "var(--radius-full)",
              boxShadow: "0 0 10px var(--color-accent)",
              display: "inline-block",
            }}
          />
          LAUME
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <nav
            aria-label={dict.nav.ariaLabel}
            className="header-nav"
            style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
          >
            <Link href={link("/home")} className="link-nav">
              {dict.nav.home}
            </Link>
            <Link href={link("/download")} className="link-nav">
              {dict.nav.download}
            </Link>
            <Link href={link("/about")} className="link-nav">
              {dict.nav.about}
            </Link>
            <Link href={link("/support")} className="link-nav">
              {dict.nav.support}
            </Link>
            <Link href={link("/legal")} className="link-nav">
              {dict.nav.legal}
            </Link>
          </nav>

          <LanguageSwitcher locale={locale} label={dict.common.languageSwitcherLabel} />
        </div>
      </div>
    </header>
  );
}
