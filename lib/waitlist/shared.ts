/**
 * BEKLEME LİSTESİ — istemci ve sunucunun paylaştığı sözleşme.
 *
 * İki niyet var, ikisi de aynı formdan gelir:
 *   launch → "Çıkınca haber ver"  (uygulama o mağazada henüz yok)
 *   city   → "Şehrime gelince haber ver" (uygulama var, şehirde rota yok)
 *
 * Doğrulama iki kez yapılır: tarayıcıda anlık geri bildirim için, sunucuda
 * (`app/api/waitlist/route.ts`) güven için. Veritabanındaki CHECK kısıtları
 * üçüncü ve son kapıdır (`layar/infra/supabase/migrations/0219_web_waitlist.sql`).
 *
 * İstemci güvenli: ağ yok, anahtar yok.
 */

export const WAITLIST_PLATFORMS = ["ios", "android"] as const;
export type WaitlistPlatform = (typeof WAITLIST_PLATFORMS)[number];

export const WAITLIST_INTENTS = ["launch", "city"] as const;
export type WaitlistIntent = (typeof WAITLIST_INTENTS)[number];

/**
 * Onay metninin sürümü. Formdaki izin cümlesi değişirse bu değer de değişir;
 * böylece her kaydın HANGİ metne onay verdiği sonradan kanıtlanabilir (KVKK).
 */
export const WAITLIST_CONSENT_VERSION = "2026-09-30";

export interface WaitlistInput {
  email: string;
  city: string;
  platform: WaitlistPlatform;
  intent: WaitlistIntent;
  locale: "tr" | "en";
  /** Zorunlu: yalnız bu konuda e-posta izni. */
  consent: true;
  /** İsteğe bağlı, ayrı izin: ara sıra haber. */
  marketing: boolean;
  /** Ziyaretçinin geldiği kanal (`?ref=` / `?utm_source=`), ör. "karakoy-qr". */
  source: string | null;
}

export type WaitlistField = "email" | "city" | "platform" | "intent" | "consent";

// Kasıtlı olarak gevşek: amaç yazım hatasını yakalamak, RFC'yi uygulamak değil.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SOURCE_RE = /^[a-z0-9][a-z0-9._-]{0,63}$/;

export function normalizeSource(raw: string | null | undefined): string | null {
  if (!raw) return null;
  const value = raw.trim().toLowerCase();
  return SOURCE_RE.test(value) ? value : null;
}

export function detectPlatform(userAgent: string): WaitlistPlatform | null {
  if (/android/i.test(userAgent)) return "android";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "ios";
  return null;
}

export function validateWaitlist(
  raw: unknown,
): { ok: true; value: WaitlistInput } | { ok: false; field: WaitlistField } {
  const data = (raw ?? {}) as Record<string, unknown>;

  const email = typeof data.email === "string" ? data.email.trim().toLowerCase() : "";
  if (email.length > 254 || !EMAIL_RE.test(email)) return { ok: false, field: "email" };

  const city = typeof data.city === "string" ? data.city.trim().replace(/\s+/g, " ") : "";
  if (city.length < 2 || city.length > 80) return { ok: false, field: "city" };

  const platform = data.platform;
  if (!WAITLIST_PLATFORMS.includes(platform as WaitlistPlatform)) {
    return { ok: false, field: "platform" };
  }

  const intent = data.intent;
  if (!WAITLIST_INTENTS.includes(intent as WaitlistIntent)) return { ok: false, field: "intent" };

  if (data.consent !== true) return { ok: false, field: "consent" };

  return {
    ok: true,
    value: {
      email,
      city,
      platform: platform as WaitlistPlatform,
      intent: intent as WaitlistIntent,
      locale: data.locale === "en" ? "en" : "tr",
      consent: true,
      marketing: data.marketing === true,
      source: normalizeSource(typeof data.source === "string" ? data.source : null),
    },
  };
}
