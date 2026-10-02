import { WAITLIST_CONSENT_VERSION, type WaitlistInput } from "./shared";

/**
 * BEKLEME LİSTESİ — sunucu tarafı yazma.
 *
 * Yalnız `join_web_waitlist_v1(...)` RPC'sini çağırır. Tablo (`web_waitlist`)
 * anon role'e HİÇ açık değildir: okuma yok, doğrudan ekleme yok. RPC
 * `security definer` olup tek bir satır ekler ve aynı e-posta + niyet zaten
 * varsa hiçbir şey yapmaz. Böylece kimse başkasının kaydını okuyamaz ya da
 * değiştiremez. Tanım: `layar/infra/supabase/migrations/0219_web_waitlist.sql`.
 *
 * Ortam değişkenleri paylaşım önizlemesiyle aynıdır (`SUPABASE_URL`,
 * `SUPABASE_ANON_KEY`, `NEXT_PUBLIC_` öneki YOK). Servis rolü anahtarı
 * buraya girmez.
 *
 * Hata türleri ayrı tutulur (CLAUDE.md kural 2): "kaydedilemedi" ile
 * "yapılandırılmadı" farklı arızalardır ve farklı düzeltme ister.
 */

export type WaitlistWriteResult =
  | { ok: true }
  | { ok: false; reason: "not_configured" | "rpc_missing" | "rejected" | "network" | "server" };

const REQUEST_TIMEOUT_MS = 5000;
const PGRST_FUNCTION_NOT_FOUND = "PGRST202";

function readEnv(): { url: string; key: string } | null {
  if (typeof window !== "undefined") {
    throw new Error("lib/waitlist/server.ts yalnız sunucuda çalışır.");
  }
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return { url: url.replace(/\/+$/, ""), key };
}

export async function joinWaitlist(input: WaitlistInput): Promise<WaitlistWriteResult> {
  const env = readEnv();
  if (!env) return { ok: false, reason: "not_configured" };

  let response: Response;
  try {
    response = await fetch(`${env.url}/rest/v1/rpc/join_web_waitlist_v1`, {
      method: "POST",
      headers: {
        apikey: env.key,
        Authorization: `Bearer ${env.key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        p_email: input.email,
        p_city: input.city,
        p_platform: input.platform,
        p_intent: input.intent,
        p_locale: input.locale,
        p_marketing: input.marketing,
        p_consent_version: WAITLIST_CONSENT_VERSION,
        p_source: input.source,
      }),
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    return { ok: false, reason: "network" };
  }

  if (response.ok) return { ok: true };

  const body = await response.json().catch(() => null);
  const code = typeof body?.code === "string" ? body.code : null;
  if (code === PGRST_FUNCTION_NOT_FOUND) return { ok: false, reason: "rpc_missing" };
  // 23514 = CHECK kısıtı. Sunucu doğrulamamızdan geçip veritabanında reddedildiyse
  // iki kural birbirinden kopmuş demektir; bunu "ağ hatası" diye gizlemeyiz.
  if (code === "23514" || response.status === 400) return { ok: false, reason: "rejected" };
  return { ok: false, reason: "server" };
}
