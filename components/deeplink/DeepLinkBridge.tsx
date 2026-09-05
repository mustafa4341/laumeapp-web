"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeHref, type Locale } from "@/lib/i18n/config";

interface DeepLinkBridgeProps {
  locale: Locale;
  letterId: string;
}

export function DeepLinkBridge({ letterId, locale }: DeepLinkBridgeProps) {
  const t = getDictionary(locale).letter;
  const [attempted, setAttempted] = useState(false);

  useEffect(() => {
    trackEvent({ name: "web_letter_revealed", payload: { letterId } });

    // Client-side deep link attempt with graceful fallback
    const appUrl = `layar://letter/${letterId}`;
    const timer = setTimeout(() => {
      setAttempted(true);
    }, 1200);

    // Attempt native URL launch
    try {
      window.location.href = appUrl;
    } catch {
      // Ignore if scheme unknown
    }

    return () => clearTimeout(timer);
  }, [letterId]);

  return (
    <div className="card" style={{ maxWidth: "520px", margin: "0 auto var(--space-8)", textAlign: "center", padding: "var(--space-8)" }}>
      {/* Visual Seal Emblem */}
      <div
        style={{
          width: "64px",
          height: "64px",
          margin: "0 auto var(--space-4)",
          borderRadius: "var(--radius-full)",
          background: "radial-gradient(circle at 35% 35%, var(--color-seal-highlight), var(--color-seal-wax) 70%, var(--color-seal-deep))",
          boxShadow: "var(--shadow-glow-seal)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--color-text-primary)",
          fontFamily: "var(--font-serif)",
          fontSize: "var(--text-xl)",
          fontWeight: 700,
        }}
      >
        L
      </div>

      <h2 style={{ fontSize: "var(--text-2xl)", color: "var(--color-text-primary)", marginBottom: "var(--space-3)" }}>
        Mektup #{letterId}
      </h2>

      <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-sm)", marginBottom: "var(--space-6)", lineHeight: "var(--leading-relaxed)" }}>
        {attempted
          ? t.bridgeFallback
          : t.bridgeConnecting}
      </p>

      {/* Action Buttons */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", marginBottom: "var(--space-6)" }}>
        <a
          href={`layar://letter/${letterId}`}
          className="btn btn-primary btn-lg"
          data-testid="btn-open-app"
        >
          {t.openInApp} &rarr;
        </a>

        <Link
          href={localeHref(locale, "/download")}
          className="btn btn-secondary"
          data-testid="btn-download-fallback"
        >
          Uygulama Yüklü Değilse İndir
        </Link>
      </div>

      <div style={{ borderTop: "1px solid var(--border-subtle)", paddingTop: "var(--space-4)" }}>
        <Link href={`/letters/${letterId}`} className="link-accent" style={{ fontSize: "var(--text-xs)" }}>
          ✦ Web Sayfasında Önizle (/letters/{letterId}) &rarr;
        </Link>
      </div>
    </div>
  );
}
