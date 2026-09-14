"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { buildResetPasswordDeepLink } from "@/lib/letters/deepLink";

interface ResetPasswordBridgeProps {
  locale: Locale;
}

/**
 * `/reset-password` — Supabase kurtarma bağlantısının indiği sayfa.
 *
 * ⚠ Bu sayfa şifreyi DEĞİŞTİRMEZ ve değiştiremez: kurtarma kodunu çözecek PKCE
 * anahtarı yalnız uygulamanın içinde durur (kaynak: FIX-026). Tek işi kullanıcıyı
 * boş ekranda bırakmamak ve adres satırındaki sorgu dizesini (`?code=…`) olduğu
 * gibi Laume uygulamasına taşımaktır.
 *
 * ⚠ OTOMATİK YÖNLENDİRME YOK. Universal/App Link'i güvenilir biçimde tetikleyen
 * şey kullanıcı hareketidir; sayfa yüklenince `window.location`'a yazmak
 * masaüstünde boş `layar://` hatası, mobilde ise tarayıcı engeli üretir.
 */
export function ResetPasswordBridge({ locale }: ResetPasswordBridgeProps) {
  const t = getDictionary(locale).resetPassword;

  // Sorgu dizesi yalnız istemcide okunur: sunucu render'ında `?code=…` yoktur
  // ve zaten kişisel bir kurtarma kodudur, HTML'e gömülmemeli.
  const [appUrl, setAppUrl] = useState<string | null>(null);
  const [hasCode, setHasCode] = useState(true);

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    setHasCode(params.has("code"));
    setAppUrl(buildResetPasswordDeepLink(search));
  }, []);

  return (
    <div
      className="card"
      style={{
        maxWidth: "520px",
        margin: "0 auto var(--space-8)",
        textAlign: "center",
        padding: "var(--space-8)",
      }}
    >
      <h1
        style={{
          fontSize: "var(--text-2xl)",
          color: "var(--color-text-primary)",
          marginBottom: "var(--space-3)",
        }}
      >
        {t.heading}
      </h1>

      <p
        style={{
          color: "var(--color-text-secondary)",
          fontSize: "var(--text-sm)",
          marginBottom: "var(--space-6)",
          lineHeight: "var(--leading-relaxed)",
        }}
      >
        {t.intro}
      </p>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
          marginBottom: "var(--space-6)",
        }}
      >
        {/* Kullanıcı dokunuşuyla tetiklenir; href mount'tan sonra kurulur ki
            kurtarma kodu sunucu HTML'ine sızmasın. */}
        <a
          href={appUrl ?? undefined}
          aria-disabled={appUrl ? undefined : true}
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
          {t.downloadCta}
        </Link>
      </div>

      {!hasCode && (
        <p
          style={{
            color: "var(--color-text-tertiary)",
            fontSize: "var(--text-xs)",
            marginBottom: "var(--space-4)",
          }}
          data-testid="missing-code-note"
        >
          {t.missingCodeNote}
        </p>
      )}

      <div
        style={{
          borderTop: "1px solid var(--border-subtle)",
          paddingTop: "var(--space-4)",
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          gap: "var(--space-3)",
        }}
      >
        <div>
          <strong
            style={{
              display: "block",
              fontSize: "var(--text-sm)",
              color: "var(--color-text-primary)",
              marginBottom: "var(--space-1)",
            }}
          >
            {t.noAppHeading}
          </strong>
          <span style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
            {t.noAppBody}
          </span>
        </div>

        <p style={{ fontSize: "var(--text-xs)", color: "var(--color-text-tertiary)" }}>
          {t.desktopNote}
        </p>
      </div>
    </div>
  );
}
