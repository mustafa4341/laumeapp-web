import React from "react";

import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

const ICONS = ["📍", "◎", "✦"];

export function HowItWorks({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const steps = dict.home.howCards.map((s, i) => ({
    num: String(i + 1).padStart(2, "0"),
    icon: ICONS[i],
    title: s.title,
    desc: s.body,
  }));
  return (
    <section aria-label={dict.home.howHeading} style={{ marginBottom: "var(--space-16)" }}>
      <div
        className="story-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "var(--space-12)",
          alignItems: "center",
          padding: "var(--space-12) 0",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-10)" }}>
          {steps.map((s) => (
            <div key={s.num}>
              <div style={{ display: "flex", alignItems: "center", gap: "var(--space-3)", marginBottom: "var(--space-2)" }}>
                <span style={{ fontFamily: "var(--font-mono)", fontSize: "var(--text-sm)", color: "var(--laume-amber-ink)", fontWeight: 700 }}>
                  {s.num}
                </span>
                <span style={{ color: "var(--laume-amber-ink)", fontSize: "var(--text-xl)" }} aria-hidden="true">
                  {s.icon}
                </span>
              </div>
              <h3
                style={{
                  fontFamily: "var(--font-editorial, var(--font-serif))",
                  fontSize: "var(--text-xl)",
                  fontWeight: 500,
                  color: "var(--laume-ink)",
                  marginBottom: "var(--space-1)",
                }}
              >
                {s.title}
              </h3>
              <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-base)" }}>{s.desc}</p>
            </div>
          ))}
        </div>

        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "var(--space-10) 0",
            borderRadius: "var(--radius-xl)",
            background: "radial-gradient(ellipse at center, #fbf7ee 0%, #f3ede0 70%, #ede6d6 100%)",
            minHeight: 520,
            justifyContent: "space-between",
          }}
        >
          <img
            src="/assets/discovery/paper-fragment-blank.png"
            alt=""
            aria-hidden="true"
            style={{ width: 110, transform: "rotate(-4deg)", filter: "drop-shadow(0 10px 16px rgba(15,23,42,0.1))" }}
          />

          <span
            aria-hidden="true"
            style={{
              width: 1,
              flex: 1,
              minHeight: 60,
              borderLeft: "1.5px dashed var(--laume-paper-edge)",
            }}
          />

          <img
            src="/assets/discovery/envelope-closed.png"
            alt=""
            aria-hidden="true"
            style={{ width: 150, filter: "drop-shadow(0 14px 22px rgba(15,23,42,0.14))" }}
          />

          <span
            aria-hidden="true"
            style={{
              width: 1,
              flex: 1,
              minHeight: 60,
              borderLeft: "1.5px dashed var(--laume-paper-edge)",
            }}
          />

          <div
            aria-hidden="true"
            style={{
              width: 70,
              height: 70,
              borderRadius: "50%",
              border: "1.5px solid var(--laume-paper-edge)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ width: 36, height: 36, borderRadius: "50%", border: "1.5px solid var(--laume-paper-edge)" }} />
          </div>
        </div>
      </div>
    </section>
  );
}
