"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

type Consent = "granted" | "denied";

export function AnalyticsConsent({
  locale,
  storageKey,
}: {
  locale: Locale;
  storageKey: string;
}) {
  const [choice, setChoice] = useState<Consent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const copy = getDictionary(locale).analytics;

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      if (saved === "granted" || saved === "denied") {
        setChoice(saved);
      } else {
        setIsOpen(true);
      }
    } catch {
      setIsOpen(true);
    }
  }, [storageKey]);

  function save(next: Consent) {
    try {
      window.localStorage.setItem(storageKey, next);
    } catch {
      // Consent still applies to this page even if storage is unavailable.
    }
    window.gtag?.("consent", "update", { analytics_storage: next });
    setChoice(next);
    setIsOpen(false);
  }

  return (
    <>
      {isOpen && (
        <aside className="analytics-consent" role="dialog" aria-label={copy.title}>
          <div>
            <strong>{copy.title}</strong>
            <p>
              {copy.body}{" "}
              <Link href={localeHref(locale, "/legal/cookies")}>{copy.details}</Link>
            </p>
          </div>
          <div className="analytics-consent-actions">
            <button type="button" className="btn btn-secondary" onClick={() => save("denied")}>
              {copy.reject}
            </button>
            <button type="button" className="btn btn-primary" onClick={() => save("granted")}>
              {copy.accept}
            </button>
          </div>
        </aside>
      )}
      {!isOpen && choice && (
        <button type="button" className="analytics-settings" onClick={() => setIsOpen(true)}>
          {copy.settings}
        </button>
      )}
    </>
  );
}
