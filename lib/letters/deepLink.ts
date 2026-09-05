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
