"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useRef } from "react";
import { AnalyticsConsent } from "./AnalyticsConsent";
import type { Locale } from "@/lib/i18n/config";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

const CONSENT_KEY = "laume_analytics_consent";

function RouteTracker({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    const query = searchParams.toString();
    window.gtag?.("config", measurementId, {
      page_path: `${pathname}${query ? `?${query}` : ""}`,
    });
  }, [measurementId, pathname, searchParams]);

  return null;
}

export function GoogleAnalytics({
  measurementId,
  locale,
}: {
  measurementId?: string;
  locale: Locale;
}) {
  if (!measurementId || !/^G-[A-Z0-9]+$/i.test(measurementId)) return null;

  const bootstrap = `
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    window.gtag = gtag;
    var savedConsent = null;
    try { savedConsent = localStorage.getItem(${JSON.stringify(CONSENT_KEY)}); } catch (e) {}
    gtag('consent', 'default', {
      analytics_storage: savedConsent === 'granted' ? 'granted' : 'denied',
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      wait_for_update: 500
    });
    gtag('js', new Date());
    gtag('config', ${JSON.stringify(measurementId)}, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false
    });
  `;

  return (
    <>
      <Script id="laume-google-analytics" strategy="afterInteractive">
        {bootstrap}
      </Script>
      <Script
        id="laume-google-analytics-library"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Suspense fallback={null}>
        <RouteTracker measurementId={measurementId} />
      </Suspense>
      <AnalyticsConsent locale={locale} storageKey={CONSENT_KEY} />
    </>
  );
}
