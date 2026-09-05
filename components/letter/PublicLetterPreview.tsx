"use client";

import React from "react";
import Link from "next/link";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeHref, type Locale } from "@/lib/i18n/config";

interface PublicLetterPreviewProps {
  locale: Locale;
  letterId: string;
}

export function PublicLetterPreview({ letterId, locale }: PublicLetterPreviewProps) {
  const t = getDictionary(locale).letter;
  return (
    <div style={{ maxWidth: "560px", margin: "0 auto" }}>
      {/* Parchment preview card */}
      <article
        style={{
          background: "linear-gradient(135deg, #fefdfb 0%, #f6f1e7 70%, #ede5d3 100%)",
          color: "#1a1816",
          padding: "var(--space-8) var(--space-6)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-xl)",
          marginBottom: "var(--space-8)",
          border: "1px solid rgba(212, 196, 168, 0.7)",
          position: "relative",
        }}
      >
        {/* Top Paper Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(0, 0, 0, 0.1)",
            paddingBottom: "var(--space-3)",
            marginBottom: "var(--space-6)",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#78716c",
              fontWeight: 600,
            }}
          >
            ● YERİNDE BIRAKILDI
          </span>
          <span
            style={{
              fontSize: "11px",
              fontFamily: "var(--font-mono)",
              color: "#a8a29e",
            }}
          >
            #{letterId}
          </span>
        </div>

        {/* Teaser Content */}
        <blockquote
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(1.2rem, 3vw, 1.5rem)",
            lineHeight: 1.45,
            color: "#1c1917",
            margin: "0 0 var(--space-4) 0",
            fontWeight: 400,
          }}
        >
          {t.previewQuote}
        </blockquote>

        <p
          style={{
            fontFamily: "var(--font-serif)",
            fontStyle: "italic",
            textAlign: "right",
            color: "#57534e",
            marginBottom: "var(--space-6)",
          }}
        >
          &mdash; Yakınındaki bir ses
        </p>

        {/* Privacy Notice Policy */}
        <div
          style={{
            borderTop: "1px dashed rgba(0, 0, 0, 0.15)",
            paddingTop: "var(--space-4)",
            fontSize: "var(--text-xs)",
            color: "#78716c",
            lineHeight: "var(--leading-relaxed)",
          }}
        >
          <strong>{t.privacyNoticeTitle}:</strong> {t.privacyNoticeBody}
        </div>
      </article>

      {/* Action CTA Deck */}
      <div style={{ textAlign: "center", display: "flex", flexDirection: "column", gap: "var(--space-4)", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", justifyContent: "center" }}>
          <a
            href={`layar://letter/${letterId}`}
            className="btn btn-primary btn-lg"
            data-testid="btn-letter-open-app"
          >
            Uygulamada Konuma Git &rarr;
          </a>

          <Link href={localeHref(locale, "/download")} className="btn btn-secondary btn-lg">
            {t.downloadCta}
          </Link>
        </div>

        <Link href={localeHref(locale, "/home")} className="link-subtle" style={{ fontSize: "var(--text-sm)" }}>
          {t.backHome}
        </Link>
      </div>
    </div>
  );
}
