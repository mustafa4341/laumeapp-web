/**
 * DERİN BAĞLANTI ÜRETİMİ — uygulamanın gerçekten tanıdığı adres
 *
 * ── DÜZELTİLEN HATA ───────────────────────────────────────────────────────
 * Web `layar://letter/<id>` üretiyordu. Uygulamanın ayrıştırıcısı
 * (`layar` deposu → `frontend/src/shared/utils/layarUrl.ts:99`) yol
 * segmentlerinde YALNIZ `n` veya `note` arar:
 *
 *     const noteIndex = segments.findIndex((s) => s === NOTE_PATH || s === 'note');
 *     if (!noteId && !refCode) return null;
 *
 * `letter` segmenti hiçbir dalda karşılanmıyor → `parseLayarUrl` `null` döner
 * → uygulama açılsa bile mektuba GİTMEZ. Kullanıcı için bu, "link çalışmıyor"
 * demektir; sessiz ve teşhis edilmesi zor bir arıza.
 *
 * ── ATIF KODU (`?ref=`) ───────────────────────────────────────────────────
 * Paylaşım adresi kodu taşır (`buildNoteShareUrl(noteId, refCode)`), uygulama
 * da onu ayrıştırır — ama web arada düşürüyordu. Kod olmadan davetin kimden
 * geldiği ölçülemez; büyüme döngüsünün tek ölçüm anahtarı budur.
 *
 * ⚠ Bu dosya uygulamanın sözleşmesinin AYNASIDIR. `layarUrl.ts` değişirse
 * burası da değişmeli; iki taraf birbirinden habersiz sapamaz.
 */

/** `layar` deposu → `frontend/app.json` → `expo.scheme`. */
const APP_SCHEME = "layar";

/** `layarUrl.ts` → `NOTE_PATH`. Kısa tutuldu; paylaşımda az yer kaplasın diye. */
const NOTE_PATH = "n";

/**
 * Mektubu uygulamada açan adres.
 *
 * @param noteId Doğrulanmış mektup kimliği (`isShareableNoteId`).
 * @param refCode Doğrulanmış atıf kodu (`normalizeRefCode`) ya da `null`.
 */
export function buildAppDeepLink(noteId: string, refCode: string | null = null): string {
  const base = `${APP_SCHEME}://${NOTE_PATH}/${encodeURIComponent(noteId)}`;
  return refCode ? `${base}?ref=${encodeURIComponent(refCode)}` : base;
}

/**
 * ŞİFRE SIFIRLAMA KÖPRÜSÜ — `layar://reset-password?code=…`
 *
 * Supabase kurtarma e-postası `https://www.laumeapp.com/reset-password?code=…`
 * adresine döner (kaynak: FIX-026). Uygulama `app.json` içinde bu yolu hem App
 * Link hem özel şema olarak tanır; web sayfasının tek işi adres satırındaki
 * sorgu dizesini OLDUĞU GİBİ uygulamaya taşımaktır — PKCE anahtarı yalnız
 * uygulamada olduğu için şifreyi burada değiştirmek mümkün değil.
 *
 * @param rawQuery `window.location.search` — baştaki `?` olsa da olmasa da olur.
 */
const RESET_PASSWORD_PATH = "reset-password";

export function buildResetPasswordDeepLink(rawQuery: string): string {
  const query = rawQuery.startsWith("?") ? rawQuery.slice(1) : rawQuery;
  const base = `${APP_SCHEME}://${RESET_PASSWORD_PATH}`;
  return query ? `${base}?${query}` : base;
}
