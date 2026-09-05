# K-25 — PAYLAŞIM LİNKİ & DERİN BAĞLANTI ZİNCİRİ (canlı checklist)

> Kapsam: `laumeapp.com/n/<id>` paylaşım linkinin uçtan uca çalışır hâle gelmesi.
> Bu dosya **canlı takip** dosyasıdır — her adım bittiğinde işaretlenir ve commit edilir.
> Kaynak karar: `layar` deposu → `audit/experience/34-TUM-KARARLAR-VE-UYGULAMA-SIRASI.md` K-13.
> Başlangıç: 2026-09-05 · Depo: `laumeapp-web` (Next.js 15, app router)
>
> **Kapsam dışı (bilinçli):** ritüel/keşif deneyimi görselleri (`components/discovery/*`,
> mühür amblemi, parşömen kart) — bunlara DOKUNULMAZ. Bu iş veri, metadata ve link
> katmanıdır; tasarım değişikliği değildir.

---

## 0. TESPİT — İŞE BAŞLAMADAN ÖNCE BULUNAN GERÇEKLER

Hepsi koddan doğrulandı (2026-09-05):

| # | Bulgu | Kanıt | Etki |
|---|---|---|---|
| **B-1** | 🔴 **Gerçek paylaşım linkleri 404 veriyor.** `isValidLetterId` = `/^[a-zA-Z0-9_-]{3,32}$/` ama mektup id'si **36 karakterlik UUID** | `app/[locale]/n/[id]/page.tsx:17`, `app/[locale]/letters/[id]/page.tsx:18` vs `layar/frontend/.../mappers.ts:16` (UUID regex) | Uygulamadan paylaşılan **her** link `notFound()`'a düşer |
| **B-2** | 🔴 **Derin bağlantı şeması uygulamanın tanımadığı bir yol kullanıyor.** Web `layar://letter/<id>` üretiyor; uygulamanın ayrıştırıcısı yalnız `n` veya `note` segmentini kabul ediyor | `components/deeplink/DeepLinkBridge.tsx:23,74` vs `layar/frontend/src/shared/utils/layarUrl.ts:99` | Uygulama yüklü olsa bile mektuba gitmez |
| **B-3** | 🔴 **Paylaşım linkinde OG önizlemesi yok.** Uygulama `/n/<id>` paylaşıyor ama o rota `robots: index:false` + OG etiketi yok; OG etiketleri hiç paylaşılmayan `/letters/<id>`'de | `app/[locale]/n/[id]/page.tsx:37-42` vs `layarUrl.ts:47` (`NOTE_PATH='n'`) | WhatsApp/X önizlemesi boş çıkar |
| **B-4** | 🟠 **Atıf (referral) kodu düşüyor.** Paylaşım linki `?ref=<kod>` taşıyor, web onu derin bağlantıya aktarmıyor | `layarUrl.ts:49` vs `DeepLinkBridge.tsx:23` | Davet döngüsü ölçülemiyor |
| **B-5** | 🟠 **Sayfa gerçek veri okumuyor.** Supabase bağlantısı hiç yok; başlık `#<id>`, içerik sabit bir marka cümlesi | `lib/` altında Supabase yok; `PublicLetterPreview.tsx:76` | Önizleme mektubu tanıtmıyor |
| **B-6** | 🟠 **`assetlinks.json` sitede yok.** `public/.well-known/` dizini hiç yok | `public/` ağacı | Android App Link doğrulaması imkânsız |
| **B-7** | 🟡 **Yanlış mağaza vaadi.** `googlePlay.status: "active"` ve canlı olmayan bir Play URL'si | `lib/config.ts:25-27` | Uygulama yayında değil → ölü link |

**Doğrulanan sözleşmeler (değiştirilmeyecek):**
- Paylaşım URL'si: `https://laumeapp.com/n/<uuid>?ref=<kod>` (`layarUrl.ts:46`)
- Uygulama şeması: `layar://n/<uuid>` (`layarUrl.ts:84,99`)
- Android paket adı: `app.layar.mobile` (`layar/frontend/app.json:45`) — `PACKAGE-VERIFIED-BY-REPO` ✅ / `PLAY-CONSOLE-VERIFIED` ⬜
- App Links host'ları: `laumeapp.com` + `www.laumeapp.com`, `autoVerify: true` (`app.json:62-71`)
- Anon önizleme RPC'si: `get_note_share_preview_v1(uuid) → (title, location_name)` (`0160`, **production'da DEĞİL**)

---

## 1. ADIMLAR

Her adım kendi commit'ini alır ve push edilir.

- [x] **A-0 · Güvenlik ağı** — iki depo da commit+push edildi (`laumeapp-web@6f4ffd7`, `layar@aaf601f`). Next.js uygulamasının tamamı sürüm kontrolüne alındı (öncesinde takipsizdi).
- [x] **A-1 · Bu checklist** yazıldı, commit edildi.
- [x] **A-2 · ID sözleşmesi (B-1)** — mektup id doğrulaması uygulamanın UUID sözleşmesiyle aynı kaynaktan; iki rota da aynı fonksiyonu kullanır. Testli.
- [x] **A-3 · Veri katmanı (B-5)** — `get_note_share_preview_v1` düz `fetch` ile (yeni bağımlılık YOK), sunucu tarafında. `not_found` / `network` / `unavailable` durumları AYRI. `.env.example`.
- [x] **A-4 · Gerçek OG metadata (B-3)** — `/n/<id>` sunucuda gerçek başlık/bölge ile OG+Twitter+canonical üretir. Görsel arayüz değişmez.
- [x] **A-5 · Derin bağlantı + atıf (B-2, B-4)** — `layar://n/<id>?ref=<kod>`; şema tek bir modülden üretilir.
- [x] **A-6 · `assetlinks.json` (B-6)** — gerçek paket adı + **placeholder SHA açıkça işaretli**. Uydurma SHA YAZILMAZ.
- [x] **A-7 · Mağaza yapılandırması (B-7)** — Play linki yayına girene kadar dürüst durum.
- [x] **A-8 · Testler + build** — birim testleri, `typecheck`, `lint`, `build`.
- [x] **A-9 · Doküman güncellemesi** — `layar` deposunda `OPEN_ISSUES.md` + `CURRENT_STATUS.md`.

---

## 2. DURUM ETİKETLERİ (dürüstlük sözleşmesi)

Bu iş bitince aşağıdaki etiketler **ayrı ayrı** raporlanır — biri diğerini kapatmaz:

```
WEB-PASS              ✅  /n/<uuid> üretim build'inde doğru durumu render ediyor
SHARE-PASS            ✅  OG/Twitter/canonical metadata sunucuda üretiliyor
PRIVACY-PASS          ✅  yalnız title + location_name; gövde/koordinat/kimlik YOK
ERROR-STATES-PASS     ✅  not_found ≠ network ≠ unavailable
CANONICAL-DOMAIN      ✅  laumeapp.com (tek kanonik host)
REAL-NOTE-TEST        🟡  PENDING-REAL-NOTE-ID — gerçek public not id'si verilmedi
MIGRATION (0160)      🟡  PENDING-APPROVAL — production'a uygulanmadı
SHA-256               🟡  PENDING-PLAY-CONSOLE — gerçek parmak izi yok
ANDROID-APP-LINK      🟡  BLOCKED-EXTERNAL — SHA + gerçek cihaz testi gerekiyor
PLAY-CONSOLE-VERIFIED 🟡  paket adı yalnız repodan doğrulandı
```

**Kural:** `APP-LINK-PASS` yalnız (gerçek SHA + canlı `assetlinks.json` + gerçek Android
cihazda link → uygulama → doğru mektup) üçü birden görüldükten sonra yazılır.

---

## 3. DIŞ BAĞIMLILIKLAR (kod tarafı bitse de kapanmayanlar)

| Bağımlılık | Kimde | Olmadan ne olmaz |
|---|---|---|
| `0160` migration'ının production'a uygulanması | kullanıcı onayı (CLAUDE.md kural 11) | Önizleme gerçek başlık/bölge gösteremez — sayfa çalışır ama "şu an yüklenemiyor" der |
| Play Console → App Signing → SHA-256 | kullanıcı | Android App Link doğrulanmaz; link tarayıcıda açılır |
| Gerçek public not id'si | kullanıcı | "Doğru mektup geliyor mu" testi yapılamaz |
| Play Store yayını | kullanıcı | Mağaza CTA'sı gerçek linke geçemez |
