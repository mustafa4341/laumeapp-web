"use client";

import Link from "next/link";
import Image from "next/image";
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
  const isHome = path === "/home";
  const homeNav = isHome
    ? [
        { href: "#hikayeler", label: dict.home.experience.nav.story },
        { href: "#muhurler", label: dict.home.experience.nav.seals },
        { href: "#guven", label: dict.home.experience.nav.trust },
      ]
    : null;

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
        className={`container ${isHome ? "home-header-container" : ""}`}
        style={{
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "var(--space-4)",
        }}
      >
        <Link
          href={link("/home")}
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
          <Image
            src="/assets/brand/laume-icon.webp"
            alt=""
            width={32}
            height={32}
            priority
            style={{ borderRadius: "9px" }}
          />
          LAUME
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "var(--space-4)" }}>
          <nav
            aria-label={dict.nav.ariaLabel}
            className={`header-nav ${isHome ? "home-header-nav" : ""}`}
            style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}
          >
            {homeNav ? (
              <>
                {homeNav.map((item) => (
                  <a href={item.href} className="link-nav" key={item.href}>
                    {item.label}
                  </a>
                ))}
                <Link href={link("/download")} className="home-download-link">
                  <span className="home-download-full">{dict.home.experience.nav.download}</span>
                  <span className="home-download-short">{dict.home.experience.nav.downloadShort}</span>
                </Link>
              </>
            ) : (
              <>
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
              </>
            )}
          </nav>

          <span className={isHome ? "home-language-switcher" : undefined}>
            <LanguageSwitcher locale={locale} label={dict.common.languageSwitcherLabel} />
          </span>
        </div>
      </div>
    </header>
  );
}
