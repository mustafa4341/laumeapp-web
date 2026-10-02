"use client";

import { useEffect, useState } from "react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";

/**
 * Kayıt doğrulama bağlantısının indiği sayfa.
 *
 * Supabase başarısız doğrulamada da buraya döner, hatayı `?error=…` veya
 * `#error=…&error_code=otp_expired` olarak ekler. Hata varken "doğrulandı"
 * demek yalan olurdu (CLAUDE.md kural 2); sayfa iki durumu ayırır. Adres
 * satırı yalnız istemcide okunur — sunucu render'ında hash yoktur.
 *
 * Kod alışverişi YAPILMAZ: doğrulama sunucuda tamamdır, kullanıcı uygulamada
 * e-posta + şifreyle giriş yapar. Böylece e-posta bilgisayarda açılsa bile
 * hesap doğrulanmış olur.
 *
 * "Laume'yi aç" otomatik tetiklenmez: özel şemayı güvenilir biçimde açan şey
 * kullanıcı hareketidir (bkz. ResetPasswordBridge).
 */
export function EmailConfirmedBridge({ locale }: { locale: Locale }) {
  const t = getDictionary(locale).emailConfirmed;
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
    setFailed(Boolean(query.get("error") || hash.get("error") || hash.get("error_code")));
  }, []);

  return (
    <div
      className="card"
      data-testid="email-confirmed"
      data-state={failed ? "error" : "ok"}
      style={{
        maxWidth: "520px",
        margin: "var(--space-8) auto",
        textAlign: "center",
        padding: "var(--space-8)",
      }}
    >
      <h1 style={{ fontSize: "var(--text-2xl)", marginBottom: "var(--space-3)" }}>
        {failed ? t.errorHeading : t.heading}
      </h1>
      <p style={{ color: "var(--color-text-secondary)", marginBottom: "var(--space-6)" }}>
        {failed ? t.errorBody : t.body}
      </p>
      <a href="layar://" className="btn btn-primary">
        {t.openInApp}
      </a>
      {!failed && (
        <p
          style={{
            marginTop: "var(--space-6)",
            color: "var(--color-text-tertiary)",
            fontSize: "var(--text-sm)",
          }}
        >
          {t.desktopNote}
        </p>
      )}
    </div>
  );
}
