/**
 * LAYAR ANALYTICS ADAPTER
 * Centralized, typed event contract for tracking the discovery funnel.
 */

export type AnalyticsEvent =
  | { name: "web_discovery_started"; payload?: Record<string, unknown> }
  | { name: "web_discovery_skipped"; payload?: { fromState: string } }
  | { name: "web_trace_revealed"; payload?: Record<string, unknown> }
  | { name: "web_fragment_revealed"; payload?: Record<string, unknown> }
  | { name: "web_distance_changed"; payload?: { meters: number } }
  | { name: "web_envelope_found"; payload?: Record<string, unknown> }
  | { name: "web_seal_hold_started"; payload?: Record<string, unknown> }
  | { name: "web_seal_completed"; payload?: { method: "hold" | "keyboard" } }
  | { name: "web_letter_pulled"; payload?: Record<string, unknown> }
  | { name: "web_letter_revealed"; payload?: { letterId?: string } }
  | { name: "web_discovery_completed"; payload?: { durationMs?: number } }
  | { name: "web_home_cta_clicked"; payload?: { platform?: "google_play" | "app_store" | "general" } }
  | { name: "web_download_cta_clicked"; payload?: { platform?: "google_play" | "app_store" | "general" } };

/**
 * Dispatches an analytics event.
 * In development, logs events to console. In production, integrates with real analytics provider.
 */
export function trackEvent(event: AnalyticsEvent): void {
  if (typeof window === "undefined") return;

  // Development debug logging
  if (process.env.NODE_ENV !== "production") {
    // console.log("[Analytics]", event.name, event.payload ?? {});
  }

  // Future provider hook (e.g. window.gtag, PostHog, Mixpanel)
  try {
    const customWindow = window as unknown as { dataLayer?: unknown[] };
    if (customWindow.dataLayer && Array.isArray(customWindow.dataLayer)) {
      customWindow.dataLayer.push({ event: event.name, ...event.payload });
    }
  } catch {
    // Fail silently in analytics to prevent breaking user flow
  }
}
