import React from "react";
import Link from "next/link";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeHref, type Locale } from "@/lib/i18n/config";

const ICONS = ["📍", "◎", "✦"];

export function Hero({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).home.hero;
  const steps = t.steps.map((s, i) => ({ ...s, icon: ICONS[i] }));
  return (
    <section aria-label={t.sectionAria} style={{ paddingTop: "var(--space-8)", paddingBottom: "var(--space-16)" }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.1fr 1fr",
          gap: "var(--space-12)",
          alignItems: "center",
        }}
        className="hero-grid"
      >
        <div>
          <span
            style={{
              fontSize: "var(--text-xs)",
              textTransform: "uppercase",
              letterSpacing: "0.14em",
              color: "var(--laume-amber-ink)",
              display: "inline-block",
              marginBottom: "var(--space-3)",
              fontWeight: 700,
            }}
          >
            {t.eyebrow}
          </span>

          <h1
            style={{
              fontFamily: "var(--font-editorial, var(--font-serif))",
              fontSize: "var(--text-4xl)",
              fontWeight: 500,
              letterSpacing: "-0.01em",
              lineHeight: "var(--leading-tight)",
              color: "var(--laume-ink)",
              marginBottom: "var(--space-4)",
            }}
          >
            {t.title}
          </h1>

          <p
            style={{
              fontSize: "var(--text-lg)",
              lineHeight: "var(--leading-snug)",
              color: "var(--color-text-secondary)",
              marginBottom: "var(--space-8)",
              maxWidth: "480px",
            }}
          >
            {t.body}
          </p>

          <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: "var(--space-5)", marginBottom: "var(--space-12)" }}>
            <Link href={localeHref(locale, "/download")} className="btn btn-primary btn-lg">
              {t.cta}
            </Link>
            <Link href={`${localeHref(locale, "/")}?replay=1`} className="link-accent" style={{ fontSize: "var(--text-base)" }}>
              {t.replay}
            </Link>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, auto)",
              gap: "var(--space-8)",
              borderTop: "1px solid var(--border-subtle)",
              paddingTop: "var(--space-6)",
            }}
          >
            {steps.map((s) => (
              <div key={s.num} style={{ display: "flex", alignItems: "center", gap: "var(--space-2)" }}>
                <span style={{ color: "var(--laume-amber-ink)", fontSize: "var(--text-lg)" }} aria-hidden="true">
                  {s.icon}
                </span>
                <span style={{ fontFamily: "var(--font-editorial, var(--font-serif))", fontSize: "var(--text-base)", color: "var(--laume-ink)" }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
          <div
            aria-hidden="true"
            style={{
              width: "min(280px, 70vw)",
              aspectRatio: "9 / 19",
              borderRadius: "36px",
              border: "8px solid #fff",
              background: "linear-gradient(160deg, #f4f1ec, #e9e4da)",
              boxShadow: "var(--shadow-xl)",
              transform: "rotate(4deg)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            <div style={{ position: "absolute", inset: 0, padding: "var(--space-4)" }}>
              <p style={{ fontSize: "var(--text-xs)", color: "var(--laume-muted)", marginBottom: "var(--space-3)" }}>{t.mapLabel}</p>
              <div style={{ position: "relative", width: "100%", height: "70%", borderRadius: "var(--radius-md)", background: "#eef1ea", overflow: "hidden" }}>
                {[
                  { top: "30%", left: "35%" },
                  { top: "48%", left: "58%" },
                  { top: "62%", left: "30%" },
                  { top: "22%", left: "70%" },
                ].map((p, i) => (
                  <span
                    key={i}
                    aria-hidden="true"
                    style={{
                      position: "absolute",
                      top: p.top,
                      left: p.left,
                      width: 14,
                      height: 14,
                      borderRadius: "50%",
                      background: i === 0 ? "var(--laume-violet)" : "var(--laume-amber)",
                      border: "2px solid #fff",
                      boxShadow: "var(--shadow-sm)",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <img
            src="/assets/discovery/envelope-closed.png"
            alt=""
            aria-hidden="true"
            style={{
              position: "absolute",
              bottom: "-6%",
              left: "8%",
              width: "min(150px, 42vw)",
              filter: "drop-shadow(0 16px 24px rgba(15,23,42,0.18))",
              transform: "rotate(-6deg)",
            }}
          />
        </div>
      </div>
    </section>
  );
}
