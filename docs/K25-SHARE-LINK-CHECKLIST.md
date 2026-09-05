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

Etiketler **ayrı ayrı** raporlanır — biri diğerini kapatmaz. Son güncelleme: 2026-09-05.

```
WEB-PASS              ✅  next build PASS · /n/<uuid> "ƒ" (sunucuda render) çıkıyor
SHARE-PASS            ✅  og:title/description/url + twitter + canonical ilk HTML'de
REAL-DATA-PASS        ✅  gerçek nottan gerçek başlık geldi (aşağıdaki kanıt)
PRIVACY-PASS          ✅  yalnız title + location_name; gövde/koordinat/kimlik YOK
ERROR-STATES-PASS     🟡  KISMİ — metadata katmanı ayırıyor, sayfa GÖVDESİ ayırmıyor (§4)
CANONICAL-DOMAIN      ✅  laumeapp.com · canonical /letters/<id>
MIGRATION (0160)      ✅  production'a UYGULANDI ve doğrulandı (2026-09-05)
DEEP-LINK-FORMAT      ✅  layar://n/<id>?ref=<kod> — uygulamanın ayrıştırıcısıyla eşleşiyor
PACKAGE-VERIFIED-BY-REPO ✅  app.layar.mobile (frontend/app.json:45)
PLAY-CONSOLE-VERIFIED 🟡  Play Console ile karşılaştırılmadı
SHA-256               🟡  PENDING-PLAY-CONSOLE — gerçek parmak izi girilmedi
ANDROID-APP-LINK      🟡  BLOCKED-EXTERNAL — SHA + gerçek cihaz testi gerekiyor
PROD-ENV              🟡  SUPABASE_URL/ANON_KEY yalnız YERELDE (.env.local); dağıtıma girilmedi
```

**Kural:** `APP-LINK-PASS` yalnız (gerçek SHA + canlı `assetlinks.json` + gerçek Android
cihazda link → uygulama → doğru mektup) üçü birden görüldükten sonra yazılır.

### Gerçek veri kanıtı (2026-09-05, yerel üretim davranışı)

Production Supabase'e karşı, gerçek bir mektupla:

```
GET /n/57f5d6f4-426a-4cc4-850c-6093051403e9
  <meta property="og:title" content="video deneme 3">        ← GERÇEK başlık
  <link rel="canonical" href="https://laumeapp.com/letters/57f5d6f4-...">

GET /en/n/57f5d6f4-...
  og:title  = "video deneme 3"      (kullanıcı içeriği çevrilmez — doğru)
  og:description = İngilizce çerçeve cümlesi · og:locale = en_US

GET /n/00000000-0000-4000-8000-000000000000   (DB'de yok)
  og:title = "Laume mührü"          ← uydurma başlık YOK, dürüst yedek

GET /.well-known/assetlinks.json → 200
```

Bu notun `location_name` alanı `null`; açıklama bu yüzden genel cümleye düştü —
**uydurma bir yer adı yazılmadı** (kural 1).

---

## 3. DIŞ BAĞIMLILIKLAR (kod tarafı bitse de kapanmayanlar)

| Bağımlılık | Kimde | Olmadan ne olmaz |
|---|---|---|
| **Dağıtım ortam değişkenleri** — `SUPABASE_URL`, `SUPABASE_ANON_KEY` | kullanıcı (Vercel → Project Settings → Environment Variables) | Canlı sitede önizleme gerçek başlık gösteremez. **Değerler mobil uygulamanınkiyle AYNI** (`layar/frontend/.env` → `EXPO_PUBLIC_SUPABASE_*`) — yeni bir sır üretmeye gerek yok, `.env.example`'daki iki isme aynı değerler girilir |
| Play Console → App Signing → SHA-256 | kullanıcı | Android App Link doğrulanmaz; link tarayıcıda açılır |
| Play Store yayını | kullanıcı | Mağaza CTA'sı gerçek linke geçemez (şu an kontrollü "coming soon") |

## 4. BİLİNEN AÇIK — hata durumlarının GÖVDEDE ayrışmaması

`generateMetadata` üç durumu ayırıyor (bulundu / bulunamadı / cevap alınamadı) ama
**sayfa gövdesi** (`DeepLinkBridge`) bu sonucu hiç almıyor: her üç durumda da
"uygulamaya bağlanılıyor" diyor. Yani gerçekten silinmiş bir mektubun linkine
tıklayan kişi, boşuna bekliyor.

Bu bilerek bu turda kapatılmadı: o yüzey ürünün **ritüel/anlatı** alanı ve
metin/tasarım kararı kullanıcıya ait. Kapatmak için gereken tek şey `preview`
sonucunun `DeepLinkBridge`'e prop olarak geçirilip üç duruma üç metin yazılması —
veri katmanı (`lib/letters/sharePreview.ts`) bunu zaten hazır veriyor.
