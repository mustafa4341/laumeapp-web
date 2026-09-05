import { isShareableNoteId } from "./noteId";

/**
 * PAYLAŞIM ÖNİZLEMESİ — sunucu tarafı veri okuma
 *
 * ── NE OKUR ───────────────────────────────────────────────────────────────
 * Yalnız `get_note_share_preview_v1(uuid) → (title, location_name)`.
 * Bu RPC `layar` deposunda `infra/supabase/migrations/0160_note_share_preview.sql`
 * ile tanımlı: anon role açık, `security definer`, ve BİLEREK yalnız iki alan
 * döndürür. Gövde, koordinat ve yazar kimliği bu yolda YOKTUR ve eklenmeyecek —
 * bunlar "fiziksel güvenlik sınıfı" veridir, 50 m kuralının tek koruması odur.
 *
 * ── NEDEN `NEXT_PUBLIC_` DEĞİL ────────────────────────────────────────────
 * Bu modül YALNIZ sunucuda çalışır. Anahtar `NEXT_PUBLIC_` ön eki taşımadığı
 * için Next onu istemci paketine hiç koymaz; anon anahtarı "gizli değil" olsa
 * bile yayılmasının hiçbir faydası yok. Servis rolü anahtarı buraya ASLA
 * girmez — o anahtar RLS'i tamamen atlar.
 *
 * `server-only` paketi kullanılmadı (bu iş için yeni bağımlılık eklenmiyor);
 * yerine aşağıda açık bir çalışma-anı koruması var. Bir istemci bileşeni bu
 * modülü yanlışlıkla import ederse sessizce boş anahtarla çalışmak yerine
 * gürültülü biçimde patlar.
 *
 * ── NEDEN HATA TÜRLERİ AYRI ───────────────────────────────────────────────
 * `CLAUDE.md` kural 2 ve 7: sunucu hatası "mektup yok" demek DEĞİLDİR.
 * Migration henüz production'a uygulanmadıysa PostgREST "fonksiyon yok" der;
 * bunu "bu mektup artık burada değil" diye göstermek kullanıcıya yalan söyler
 * ve gerçek bir arızayı sessizce gizler.
 */

export type SharePreview =
  /** Mektup bulundu. Alanlar sunucuda `null` olabilir — uydurulmaz. */
  | { kind: "found"; title: string | null; locationName: string | null }
  /** Sunucu kesin olarak "böyle bir mektup yok" dedi (silinmiş/süresi geçmiş/yanlış id). */
  | { kind: "not_found" }
  /** Cevap alınamadı. Mektubun var olup olmadığı BİLİNMİYOR. */
  | {
      kind: "unavailable";
      reason:
        | "not_configured" // ortam değişkenleri yok (henüz bağlanmadı)
        | "rpc_missing" // 0160 migration'ı production'a uygulanmadı
        | "network" // ağ/zaman aşımı
        | "server"; // 5xx veya beklenmeyen gövde
    };

const REQUEST_TIMEOUT_MS = 4000;

/**
 * PostgREST'in "böyle bir fonksiyon yok" kodu. Migration uygulanmadan bu gelir
 * ve `not_found` ile karıştırılmamalıdır.
 * https://postgrest.org/en/stable/references/errors.html
 */
const PGRST_FUNCTION_NOT_FOUND = "PGRST202";

function readEnv(): { url: string; key: string } | null {
  if (typeof window !== "undefined") {
    throw new Error(
      "sharePreview.ts sunucu tarafı bir modüldür; istemciden çağrılamaz " +
        "(Supabase anahtarı istemci paketine girmez).",
    );
  }
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;
  return { url: url.replace(/\/+$/, ""), key };
}

/** Ortam bağlı mı? Sayfa "yapılandırılmadı" ile "arıza"yı ayırabilsin diye. */
export function isSharePreviewConfigured(): boolean {
  return readEnv() !== null;
}

export async function fetchSharePreview(noteId: string): Promise<SharePreview> {
  // Biçim kontrolü çağıranda da var; burada tekrar ediyoruz çünkü bu fonksiyon
  // ağa çıkıyor — doğrulanmamış bir değeri sunucuya göndermek gereksiz risk.
  if (!isShareableNoteId(noteId)) return { kind: "not_found" };

  const env = readEnv();
  if (!env) return { kind: "unavailable", reason: "not_configured" };

  let response: Response;
  try {
    response = await fetch(`${env.url}/rest/v1/rpc/get_note_share_preview_v1`, {
      method: "POST",
      headers: {
        apikey: env.key,
        Authorization: `Bearer ${env.key}`,
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ p_note_id: noteId }),
      // Önizleme fiziksel bir iddia taşımaz ama bayat bir başlık da göstermek
      // istemiyoruz; paylaşım linki trafiği düşük, her istek tazedir.
      cache: "no-store",
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
  } catch {
    // Zaman aşımı, DNS, TLS — hepsi "bilinmiyor", "yok" değil.
    return { kind: "unavailable", reason: "network" };
  }

  if (!response.ok) {
    // Fonksiyon yoksa (migration uygulanmadıysa) PostgREST 404 + PGRST202 döner.
    // Bu, "mektup bulunamadı" ile aynı HTTP kodunu paylaşır ama AYNI ŞEY DEĞİLDİR.
    const body = await response.json().catch(() => null);
    const code = typeof body?.code === "string" ? body.code : null;
    if (code === PGRST_FUNCTION_NOT_FOUND) {
      return { kind: "unavailable", reason: "rpc_missing" };
    }
    return { kind: "unavailable", reason: "server" };
  }

  const rows = await response.json().catch(() => null);
  if (!Array.isArray(rows)) return { kind: "unavailable", reason: "server" };

  // `returns table` → 0 satır, sunucunun kesin cevabıdır: böyle bir mektup yok.
  if (rows.length === 0) return { kind: "not_found" };

  const row = rows[0] ?? {};
  return {
    kind: "found",
    title: typeof row.title === "string" && row.title.trim() ? row.title : null,
    locationName:
      typeof row.location_name === "string" && row.location_name.trim()
        ? row.location_name
        : null,
  };
}
