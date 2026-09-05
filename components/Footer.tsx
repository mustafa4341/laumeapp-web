"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { localeHref, splitLocale, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export default function Footer({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "/";
  const { path } = splitLocale(pathname);
  if (path === "/") return null;

  const dict = getDictionary(locale);
  const link = (p: string) => localeHref(locale, p);

  const headingStyle = {
    color: "var(--color-text-primary)",
    fontSize: "var(--text-base)",
    fontWeight: 600,
    marginBottom: "var(--space-3)",
  } as const;

  const listStyle = {
    listStyle: "none",
    display: "flex",
    flexDirection: "column",
    gap: "var(--space-2)",
  } as const;

  return (
    <footer
      style={{
        borderTop: "1px solid var(--border-subtle)",
        backgroundColor: "var(--color-bg-surface)",
        padding: "var(--space-12) var(--space-6) var(--space-10)",
        color: "var(--color-text-secondary)",
        fontSize: "var(--text-sm)",
        marginTop: "auto",
      }}
    >
      <div
        className="container"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "var(--space-8)",
          marginBottom: "var(--space-10)",
        }}
      >
        <div>
          <h3 style={headingStyle}>LAUME</h3>
          <p
            style={{
              lineHeight: "var(--leading-normal)",
              maxWidth: "240px",
              color: "var(--color-text-secondary)",
            }}
          >
            {dict.footer.blurb}
          </p>
        </div>

        <div>
          <h3 style={headingStyle}>{dict.footer.navHeading}</h3>
          <ul style={listStyle}>
            <li>
              <Link href={link("/")} className="link-subtle">
                {dict.footer.discovery}
              </Link>
            </li>
            <li>
              <Link href={link("/home")} className="link-subtle">
                {dict.footer.productHome}
              </Link>
            </li>
            <li>
              <Link href={link("/download")} className="link-subtle">
                {dict.footer.downloadCenter}
              </Link>
            </li>
            <li>
              <Link href={link("/about")} className="link-subtle">
                {dict.footer.about}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 style={headingStyle}>{dict.footer.supportHeading}</h3>
          <ul style={listStyle}>
            <li>
              <Link href={link("/support")} className="link-subtle">
                {dict.footer.supportCenter}
              </Link>
            </li>
            <li>
              <Link href={link("/support/faq")} className="link-subtle">
                {dict.footer.faq}
              </Link>
            </li>
            <li>
              <Link href={link("/support/contact")} className="link-subtle">
                {dict.footer.contact}
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 style={headingStyle}>{dict.footer.legalHeading}</h3>
          <ul style={listStyle}>
            <li>
              <Link href={link("/legal")} className="link-subtle">
                {dict.footer.legalCenter}
              </Link>
            </li>
            <li>
              <Link href={link("/legal/privacy")} className="link-subtle">
                {dict.footer.privacy}
              </Link>
            </li>
            <li>
              <Link href={link("/legal/terms")} className="link-subtle">
                {dict.footer.terms}
              </Link>
            </li>
            <li>
              <Link href={link("/legal/community-guidelines")} className="link-subtle">
                {dict.footer.community}
              </Link>
            </li>
            <li>
              <Link href={link("/legal/cookies")} className="link-subtle">
                {dict.footer.cookies}
              </Link>
            </li>
            <li>
              <Link href={link("/legal/refunds")} className="link-subtle">
                {dict.footer.refunds}
              </Link>
            </li>
            <li>
              {/* Dilden bağımsız statik sayfa — Play Console'a bu adres bildirildi. */}
              {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- statik HTML, uygulama rotası değil */}
              <a href="/delete-account" className="link-subtle">
                {dict.footer.deleteAccount}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div
        className="container"
        style={{
          paddingTop: "var(--space-6)",
          borderTop: "1px solid var(--border-subtle)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--space-3)",
          fontSize: "var(--text-xs)",
        }}
      >
        <p>
          &copy; {new Date().getFullYear()} LAUME. {dict.footer.rights}
        </p>
        <p style={{ color: "var(--color-text-tertiary)" }}>{dict.footer.domainTagline}</p>
      </div>
    </footer>
  );
}
