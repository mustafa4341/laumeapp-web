import React from "react";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeHref, type Locale } from "@/lib/i18n/config";

export function ProductIntro({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).home.intro;
  return (
    <section aria-label={t.sectionAria} style={{ marginBottom: "var(--space-16)" }}>
      <div className="card" style={{ padding: "var(--space-10)" }}>
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
            fontSize: "var(--text-2xl)",
            fontWeight: 600,
            lineHeight: "var(--leading-snug)",
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-4)",
          }}
        >
          {t.title}
        </h2>

        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-base)", marginBottom: "var(--space-4)" }}>
          {t.p1}
        </p>

        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-base)", marginBottom: "var(--space-8)" }}>
          {t.p2}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: "var(--space-4)",
            borderTop: "1px solid var(--border-subtle)",
            paddingTop: "var(--space-6)",
          }}
        >
          <div>
            <h3 style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)", marginBottom: "var(--space-1)" }}>
              ✦ {t.pillars[0].title}
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
              {t.pillars[0].body}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)", marginBottom: "var(--space-1)" }}>
              ✦ {t.pillars[1].title}
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
              {t.pillars[1].body}
            </p>
          </div>

          <div>
            <h3 style={{ fontSize: "var(--text-base)", color: "var(--color-text-primary)", marginBottom: "var(--space-1)" }}>
              ✦ {t.pillars[2].title}
            </h3>
            <p style={{ fontSize: "var(--text-sm)", color: "var(--color-text-secondary)" }}>
              {t.pillars[2].body}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
