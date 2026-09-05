/**
 * MEKTUP KİMLİĞİ SÖZLEŞMESİ — paylaşım linkinin tek doğrulama noktası
 *
 * ── NEDEN AYRI BİR MODÜL ──────────────────────────────────────────────────
 * Aynı kural iki rotada (`/n/[id]` ve `/letters/[id]`) ayrı ayrı yazılmıştı ve
 * ikisi de YANLIŞTI: `/^[a-zA-Z0-9_-]{3,32}$/`. Mektup kimliği 36 karakterlik
 * bir UUID olduğu için (8-4-4-4-12 = 32 onaltılık + 4 tire) bu kalıp
 * uygulamadan gelen GERÇEK her linki reddediyor ve sayfa 404'e düşüyordu.
 *
 * Kural artık tek yerde yaşıyor; iki rota da buradan sorar.
 *
 * ── KAYNAK SÖZLEŞME (mobil uygulama) ──────────────────────────────────────
 * Paylaşım adresi `layar` deposunda üretiliyor:
 *
 *   frontend/src/shared/utils/layarUrl.ts:46
 *     buildNoteShareUrl(noteId) → `https://laumeapp.com/n/<noteId>?ref=<kod>`
 *
 *   frontend/src/features/notes/screens/ReadingScreen.tsx:348
 *     buildNoteShareUrl(note.id, refCode)   ← note.id, yani notun UUID'si
 *
 * Uygulamanın kendi doğrulayıcısı (`notes/api/mappers.ts:16`) ile aynı kalıbı
 * kullanıyoruz — biri değişirse diğeri de değişmeli.
 *
 * ⚠ Uygulama ayrıca `demo-` ön ekli kimlikleri kabul eder; onlar yalnız cihaz
 * içi demo oturumuna aittir, sunucuda karşılığı yoktur ve paylaşılamazlar.
 * Bu yüzden web BİLEREK yalnız gerçek UUID kabul eder.
 */

/** RFC 4122 sürüm 1-5 UUID. Uygulamadaki `isValidUUID` ile birebir aynı. */
const NOTE_ID_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

/**
 * Bu kimlik paylaşılabilir bir mektuba işaret ediyor olabilir mi?
 *
 * "Olabilir" — bu yalnız BİÇİM kontrolüdür. Mektubun gerçekten var olup
 * olmadığı sunucudan sorulur (`lib/letters/sharePreview.ts`). İkisini
 * karıştırmak, var olmayan bir mektup ile bozuk bir linki aynı hataya
 * düşürür; kullanıcıya yanlış sebep gösterilir.
 */
export function isShareableNoteId(id: string): boolean {
  return NOTE_ID_PATTERN.test(id);
}

/**
 * Paylaşan kişinin atıf kodu (`?ref=`) — büyüme döngüsünün ölçüm anahtarı.
 *
 * `profiles.ref_code` üretimi sunucuda; web onu yalnız TAŞIR, üretmez veya
 * yorumlamaz. Bu yüzden kalıp dar tutuldu: taşıdığımız değerin bir enjeksiyon
 * yüzeyi olmadığından emin olmak için (derin bağlantı URL'sine yazılıyor).
 */
const REF_CODE_PATTERN = /^[A-Za-z0-9_-]{1,32}$/;

/** Geçerliyse kodu, değilse `null` döndürür — sessizce kırpmaz. */
export function normalizeRefCode(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (!raw) return null;
  return REF_CODE_PATTERN.test(raw) ? raw : null;
}
