import React from "react";
import Link from "next/link";
import { StoreButtons } from "./StoreButtons";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeHref, type Locale } from "@/lib/i18n/config";

export function DownloadCTA({ locale }: { locale: Locale }) {
  const d = getDictionary(locale);
  const t = d.home.cta;
  return (
    <section aria-label={t.sectionAria} style={{ marginBottom: "var(--space-12)" }}>
      <div
        className="card"
        style={{
          padding: "var(--space-12) var(--space-6)",
          textAlign: "center",
          border: "1px solid var(--border-medium)",
          background: "linear-gradient(180deg, var(--color-bg-card) 0%, var(--color-bg-surface) 100%)",
        }}
      >
        <span
          style={{
            fontSize: "var(--text-xs)",
            textTransform: "uppercase",
            letterSpacing: "0.12em",
            color: "var(--color-accent)",
            display: "inline-block",
            marginBottom: "var(--space-2)",
            fontWeight: 600,
          }}
        >
          {t.eyebrow}
        </span>

        <h2
          style={{
            fontSize: "var(--text-3xl)",
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-3)",
            fontWeight: 600,
          }}
        >
          {t.title}
        </h2>

        <p
          style={{
            color: "var(--color-text-secondary)",
            fontSize: "var(--text-base)",
            maxWidth: "480px",
            margin: "0 auto var(--space-8)",
          }}
        >
          {t.body}
        </p>

        <div style={{ display: "flex", justifyContent: "center", marginBottom: "var(--space-8)" }}>
          <StoreButtons size="lg" />
        </div>

        {/* Support & Legal Links */}
        <div
          style={{
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "var(--space-6)",
            display: "flex",
            justifyContent: "center",
            gap: "var(--space-6)",
            flexWrap: "wrap",
            fontSize: "var(--text-xs)",
          }}
        >
          <Link href={localeHref(locale, "/support")} className="link-subtle">
            Destek Merkezi
          </Link>
          <Link href={localeHref(locale, "/legal/privacy")} className="link-subtle">
            {d.footer.privacy}
          </Link>
          <Link href={localeHref(locale, "/legal/terms")} className="link-subtle">
            {d.footer.terms}
          </Link>
          {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- statik HTML, uygulama rotası değil */}
          <a href="/delete-account" className="link-subtle">
            {d.footer.deleteAccount}
          </a>
        </div>
      </div>
    </section>
  );
}
