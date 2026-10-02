"use client";

import React, { useEffect, useId, useRef, useState } from "react";
import styles from "./getapp.module.css";
import { appConfig } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import { getDictionary } from "@/lib/i18n/dictionaries";
import { localeHref, type Locale } from "@/lib/i18n/config";
import {
  validateWaitlist,
  type WaitlistField,
  type WaitlistIntent,
  type WaitlistPlatform,
} from "@/lib/waitlist/shared";

interface Props {
  locale: Locale;
  open: boolean;
  intent: WaitlistIntent;
  initialPlatform: WaitlistPlatform | null;
  source: string | null;
  onClose: () => void;
}

type Status = "idle" | "submitting" | "success" | "error";

/**
 * "Çıkınca haber ver" / "Şehrime gelince haber ver" formu.
 *
 * Yerel `<dialog>` + `showModal()`: odak tuzağı, Escape ile kapanma ve arka
 * planın etkisizleşmesi tarayıcıdan gelir. Klavye olayları diyalogdan dışarı
 * sızmaz — keşif sahnesi Escape'i "keşfi geç" olarak dinliyor; formu kapatmak
 * istenirken ziyaretçiyi sahneden atmak olmazdı.
 *
 * İki izin ayrıdır (KVKK): zorunlu olan yalnız "bu konuda yazılması";
 * pazarlama izni isteğe bağlı ve varsayılanı kapalı.
 */
export function WaitlistSheet({ locale, open, intent, initialPlatform, source, onClose }: Props) {
  const t = getDictionary(locale).getApp.waitlist;
  const dialogRef = useRef<HTMLDialogElement | null>(null);
  const formId = useId();

  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [platform, setPlatform] = useState<WaitlistPlatform | null>(initialPlatform);
  const [consent, setConsent] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [trap, setTrap] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<WaitlistField | null>(null);

  // Her açılışta tıklanan rozetin platformu seçili gelsin.
  useEffect(() => {
    if (open) {
      setPlatform(initialPlatform);
      setFieldError(null);
      if (status !== "success") setStatus("idle");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, initialPlatform]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      try {
        dialog.showModal();
      } catch {
        dialog.setAttribute("open", "");
      }
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (status === "submitting") return;

    const payload = {
      email,
      city,
      platform,
      intent,
      locale,
      consent,
      marketing,
      source,
      website: trap,
    };
    const check = validateWaitlist(payload);
    if (!check.ok) {
      setFieldError(check.field);
      return;
    }

    setFieldError(null);
    setStatus("submitting");
    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const body = (await response.json().catch(() => null)) as
        | { ok: boolean; error?: string; field?: WaitlistField }
        | null;
      if (response.ok && body?.ok) {
        setStatus("success");
        trackEvent({
          name: "web_waitlist_submitted",
          payload: { platform: check.value.platform, intent },
        });
        return;
      }
      if (body?.error === "invalid" && body.field) {
        setStatus("idle");
        setFieldError(body.field);
        return;
      }
      setStatus("error");
      trackEvent({ name: "web_waitlist_failed", payload: { reason: body?.error ?? `http_${response.status}` } });
    } catch {
      setStatus("error");
      trackEvent({ name: "web_waitlist_failed", payload: { reason: "network" } });
    }
  };

  const errorText = fieldError ? t.errors[fieldError === "intent" ? "server" : fieldError] : null;
  const mailto = `mailto:${appConfig.supportEmail}?subject=${encodeURIComponent(
    intent === "city" ? t.cityEyebrow : t.launchEyebrow,
  )}`;

  return (
    <dialog
      ref={dialogRef}
      className={styles.sheet}
      aria-labelledby={`${formId}-title`}
      data-testid="waitlist-sheet"
      onClose={onClose}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onKeyDown={(e) => e.stopPropagation()}
      onKeyUp={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      onClick={(e) => {
        // Arka plana (diyalog kutusunun dışına) tıklamak kapatır.
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className={styles.sheetInner}>
        <button type="button" className={styles.close} onClick={onClose} aria-label={t.close}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <span className={styles.seal} aria-hidden="true" />

        {status === "success" ? (
          <div className={styles.success} role="status" data-testid="waitlist-success">
            <h2 id={`${formId}-title`} className={styles.sheetTitle}>
              {t.successTitle}
            </h2>
            <p className={styles.sheetBody}>{intent === "city" ? t.successCity : t.successLaunch}</p>
            <p className={styles.fine}>{t.unsubscribeNote}</p>
            <button type="button" className={styles.submit} onClick={onClose}>
              {t.close}
            </button>
          </div>
        ) : (
          <form onSubmit={submit} noValidate>
            <p className={styles.eyebrow}>{intent === "city" ? t.cityEyebrow : t.launchEyebrow}</p>
            <h2 id={`${formId}-title`} className={styles.sheetTitle}>
              {intent === "city" ? t.cityTitle : t.launchTitle}
            </h2>
            <p className={styles.sheetBody}>{intent === "city" ? t.cityBody : t.launchBody}</p>

            <div className={styles.fields}>
              <label className={styles.field}>
                <span className={styles.label}>{t.email}</span>
                <input
                  type="email"
                  name="email"
                  inputMode="email"
                  autoComplete="email"
                  // eslint-disable-next-line jsx-a11y/no-autofocus -- diyalog açılınca ilk alan
                  autoFocus
                  required
                  maxLength={254}
                  placeholder={t.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={fieldError === "email"}
                  className={styles.input}
                />
              </label>

              <label className={styles.field}>
                <span className={styles.label}>{t.city}</span>
                <input
                  type="text"
                  name="city"
                  autoComplete="address-level2"
                  required
                  maxLength={80}
                  placeholder={t.cityPlaceholder}
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  aria-invalid={fieldError === "city"}
                  className={styles.input}
                />
              </label>

              <fieldset className={styles.field} aria-invalid={fieldError === "platform"}>
                <legend className={styles.label}>{t.platform}</legend>
                <div className={styles.segment}>
                  {(["ios", "android"] as const).map((value) => (
                    <label key={value} className={styles.segmentOption}>
                      <input
                        type="radio"
                        name="platform"
                        value={value}
                        checked={platform === value}
                        onChange={() => setPlatform(value)}
                      />
                      <span>{value === "ios" ? t.ios : t.android}</span>
                    </label>
                  ))}
                </div>
              </fieldset>
            </div>

            {/* Bal küpü — ekran okuyucudan ve sekme sırasından da gizli. */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className={styles.trap}
              value={trap}
              onChange={(e) => setTrap(e.target.value)}
            />

            <label className={styles.check}>
              <input
                type="checkbox"
                name="consent"
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                aria-invalid={fieldError === "consent"}
              />
              <span>{t.consent}</span>
            </label>
            <label className={styles.check}>
              <input
                type="checkbox"
                name="marketing"
                checked={marketing}
                onChange={(e) => setMarketing(e.target.checked)}
              />
              <span>{t.marketing}</span>
            </label>

            <p className={styles.fine}>
              {t.consentPrivacyLead}{" "}
              <a href={localeHref(locale, "/legal/privacy")} target="_blank" rel="noopener noreferrer">
                {t.consentPrivacyLink}
              </a>
            </p>

            <div className={styles.messages} aria-live="polite">
              {errorText && (
                <p className={styles.error} data-testid="waitlist-error">
                  {errorText}
                </p>
              )}
              {status === "error" && (
                <p className={styles.error} data-testid="waitlist-error">
                  {t.errors.server} {t.errors.fallbackLead}{" "}
                  <a href={mailto}>{appConfig.supportEmail}</a>
                </p>
              )}
            </div>

            <button type="submit" className={styles.submit} disabled={status === "submitting"}>
              {status === "submitting" ? t.submitting : t.submit}
            </button>
          </form>
        )}
      </div>
    </dialog>
  );
}
