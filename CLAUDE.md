# CLAUDE.md — LAUME WEB AI ÇALIŞMA SÖZLEŞMESİ

> Bu dosya bu deponun **AI çalışma sözleşmesidir**. Kod değil, karar rehberidir.
> Kurulum: 2026-09-05 · Sürüm: v1
> Bu dosya kodun, mağaza kaydının veya canlı sitenin yerine geçmez.

---

## A. BU DEPO NEDİR

`laumeapp.com` — Laume mobil uygulamasının **pazarlama ve yasal web sitesi**.
Next.js 15 (App Router) + TypeScript. Sunucu yok, veritabanı yok: tamamen
statik/SSR sayfalar.

Uygulamanın kendisi **ayrı bir depodadır**: `C:\Users\mmust\Desktop\layar`
(Expo/React Native + Supabase). Ürün gerçeği oradan gelir; bu depo onu anlatır.

### Ürün tek cümlede

> **Bir mektup bir yere aittir.** Gerçek bir yere mektup bırakırsın; onu okumanın
> tek yolu oraya gitmektir. 50 metreye yaklaşınca mühür açılır.

Bu cümle uydurma değil, mağaza kaydının birebir konumlandırmasıdır. Kaynak:
`layar/docs/PLAY-CONSOLE-YAYIN-DOSYASI.md` §9.

---

## B. PAZARLIKSIZ KURALLAR

1. **Marka "Laume"dur, "Layar" değildir.** Layar eski koddaki iç adlandırmadır
   (paket kimliği `app.layar.mobile` hâlâ öyle). Kullanıcıya görünen hiçbir
   metinde "Layar" geçmez. Kapı: `e2e/discovery.spec.ts` son testi.
   Tek istisna: `layar_discovery_completed` localStorage anahtarı — geriye dönük
   uyumluluk için korunur, **yeniden adlandırılmaz**.

2. **Uydurma veri yok.** Sahte puan, sahte indirme sayısı, olmayan sosyal hesap,
   yayında olmayan mağaza linki — hiçbiri yazılmaz. `aggregateRating` ve
   `sameAs` bu yüzden yapısal veride yoktur; gerçek olduklarında eklenir.
   App Store yayında değil: link yerine devre dışı buton gösterilir.

3. **Metin sözlükte yaşar, JSX'te değil.** Kullanıcıya görünen her string
   `lib/i18n/dictionaries/` altındadır. Bileşene doğrudan metin yazılmaz;
   yazılırsa o metin hiçbir zaman çevrilmez ve kimse fark etmez.

4. **İç bağlantılar `localeHref()` üzerinden geçer.** Elle yazılan `/download`
   İngilizce sayfada kullanıcıyı Türkçeye düşürür. Hiçbir yerde hata vermez;
   bu yüzden tehlikelidir. Kapı: `e2e/i18n.spec.ts` "iç bağlantılar dili korur".

5. **SEO metni mağaza kaydıyla aynı şeyi anlatır.** Google, mağaza kaydı ile
   resmî siteyi aynı varlık (entity) saymak için eşleşen isim + açıklama + URL
   arar. İki yerde iki farklı açıklama, tek güçlü sinyal yerine iki zayıf
   sinyal üretir. Açıklamayı değiştirirken mağaza kaydını da güncelle.

6. **Play Console'a bildirilen URL'ler 404 veremez.**
   `/privacy`, `/terms`, `/delete-account` — yayın dosyası açıkça uyarıyor:
   *"404/redirect/login duvarı = otomatik red"*. Bu yüzden **redirect değil
   rewrite** kullanılır (200 döner). Kapı: `e2e/i18n.spec.ts` son iki testi.

7. **Kanıtsız "düzeltildi" yok.** Kod değişikliği tek başına doğrulama değildir.
   `npx tsc --noEmit` + `npm run build` + `npx playwright test` üçü de geçmeden
   bir iş bitmiş sayılmaz.

8. **Keşif sahnesi bir bileşendir, sahne dizisi değil.** `EnvelopeRig` durumlar
   arasında **hiç unmount olmaz**. Bu kural ihlal edilirse mühür kırılma ve
   mektup çekme animasyonları sessizce oynamaz hâle gelir (bkz. §E).

---

## C. MİMARİ

| Katman | Gerçek |
|---|---|
| Çatı | Next.js 15.5 App Router, React 19, TypeScript |
| Rota ağacı | `app/[locale]/...` — kök layout burada, `app/layout.tsx` **yoktur** |
| Dil yönlendirme | `middleware.ts` — varsayılan dil ön eksiz, diğerleri `/en/...` |
| Çeviri | `lib/i18n/` (bkz. §D) |
| Stil | CSS Modules + `app/globals.css` içindeki tasarım token'ları |
| Statik sayfalar | `public/*.html` — hesap silme, eski gizlilik/destek kopyaları |
| Test | Playwright, `e2e/discovery.spec.ts` + `e2e/i18n.spec.ts` |

### Rota sözleşmesi

```
/                      → TR keşif sahnesi        (app/[locale]/page.tsx)
/en                    → EN keşif sahnesi
/home                  → TR pazarlama ana sayfası
/tr/*                  → 308 → ön eksiz karşılığı (kanonik değildir)
/privacy               → rewrite → /legal/privacy (canonical: /legal/privacy)
/terms                 → rewrite → /legal/terms
/delete-account        → rewrite → public/delete-account.html (dilden bağımsız)
/privacy.html          → 308 → /legal/privacy
/support.html          → 308 → /support
/n/[id]                → derin bağlantı köprüsü; taranır ama `noindex`
```

**Sıralama tuzağı:** Next.js'te sıra `redirects → middleware → rewrites`.
`/delete-account` bu yüzden middleware'de `PASSTHROUGH` içindedir; olmasaydı
middleware onu dile sokar ve `next.config.mjs`'deki rewrite'a hiç ulaşılmazdı.

---

## D. ÇOK DİLLİLİK — YENİ DİL EKLEME

Üç adım, başka hiçbir yere dokunulmaz:

1. `lib/i18n/dictionaries/<kod>.ts` — `tr.ts`'i kopyala, çevir.
   Dosya `Dictionary` tipinde olduğu için **eksik anahtar derleme hatasıdır**;
   çeviri sessizce yarım kalamaz.
2. `lib/i18n/config.ts` → `LOCALES` dizisine ve `LOCALE_META` tablosuna ekle.
3. `lib/i18n/dictionaries/index.ts` → `DICTIONARIES` haritasına ekle.

Yönlendirme, `hreflang`, sitemap, dil değiştirici ve yapısal veri kendiliğinden
güncellenir.

| Dosya | Sorumluluk |
|---|---|
| `lib/i18n/config.ts` | Dil listesi, ön ek kuralı, `localeHref`, `splitLocale`. **İstemci güvenli.** |
| `lib/i18n/dictionaries/` | Tüm metinler. `tr.ts` referans dildir, tip ondan türer. **İstemci güvenli.** |
| `lib/i18n/index.ts` | `buildMetadata`, `alternatesFor`, `buildJsonLd`. `next` tiplerine bağımlı — **yalnız sunucu**. |
| `lib/i18n/page.ts` | `resolveLocale` — sayfa `params` çözümlemesi. |

**Referans dil Türkçedir.** Yeni metin önce `tr.ts`'e yazılır.

---

## E. YAPILANLAR VE NEDENLERİ

### 2026-09-05 · Keşif deneyimi baştan yazıldı

**SORUN:** Mühür kırılma animasyonu oynamıyor, mektup açılamıyor, iz tek bir
köşede görünmüyor, sis hiçbir şeyi gizlemiyordu.

**KÖK NEDEN:** Her aşama ayrı bir bileşendi (`SealReadyState`, `LetterPullState`…).
Mühür kırılınca o bileşen **unmount** oluyordu; yerine gelen bileşen kırık
parçaları zaten son konumunda render ediyordu, yani CSS geçişi hiç oynamıyordu.
Mektupta aynı hata: `--pull` React inline style'ıyla yönetildiği için her
render'da sıfırlanıyor, sürükleme dinleyicisi elementin üzerinde olduğu için
imleç kâğıttan çıkınca jest kopuyordu.

**ÇÖZÜM:** Tek ve kalıcı `EnvelopeRig`. Zarf, mühür ve mektup hiç unmount olmaz;
tüm aşamalar aynı DOM ağacında CSS geçişleriyle akar. Sürükleme `window`
üzerinde dinlenir + pointer capture.

**DİĞER DÜZELTMELER:**
- `physical-trace.png` tek blok hâlinde konuyordu. Alfa kanalı taranarak
  (`scripts/measure-trace-steps.mjs`) 10 ayak izi tek tek kesildi; izler artık
  bir Bézier eğrisi boyunca diziliyor ve sırayla açılıyor.
- Ön cep ile arka zarf katmanı **farklı ölçekte üretilmiş**: ön cebin gövdesi
  ~%25 geniş. `scripts/measure-assets.mjs` ile ölçülüp `scale(0.798)` +
  `translate(10.1%, 21.5%)` ile birebir hizalandı.
- Pus, ipuçlarının altında kalıyordu → `FogField` yeniden yazıldı.
- Ses motoru baştan yazıldı (`lib/audio/soundEngine.ts`).
- Çift gönderilen analitik olayları, `<button>` içinde `<article>` (geçersiz
  HTML) düzeltildi.

### 2026-09-05 · SEO: marka ve konumlandırma

**SORUN:** `/` dışındaki **her sayfanın** metadata'sı "Layar" diyordu ve
açıklama *"Yerinde Bırakılan Mektuplar / konum temelli keşif uygulaması"*
şeklinde genel geçerdi — hiçbir aramayı kazanmayan, mağaza kaydıyla
çelişen bir metin.

**ÇÖZÜM:** Tüm metinler mağaza kaydının konumlandırmasına çekildi; marka
"Laume" oldu (görsel kelime markası ekranda **LAUME** kalır).

**BULUNAN GERÇEK HATALAR:**

| Hata | Neden önemliydi |
|---|---|
| `/privacy`, `/terms`, `/delete-account` → **404** | Play Console'a bu adresler bildirilmişti; yayın dosyası "404 = otomatik red" diyor |
| Play mağaza linki `com.laumeapp`'e gidiyordu | Gerçek paket `app.layar.mobile` — indir butonu kırıktı |
| `robots.txt` `/n/*`'i tarama dışı bırakıyordu | Taraması engellenen sayfanın `noindex` etiketi hiç okunmaz; dışarıdan link gelince yine indekslenir |
| `sitemap.lastModified = new Date()` | Her build'de "her şey güncellendi" yalanı; tarama bütçesi israfı |
| `/privacy.html` + `/legal/privacy` aynı içerik | İki indekslenebilir adres → 308 ile tekilleştirildi |
| `/` ve `/home` aynı başlık | Aynı sorguda birbirleriyle yarışıyorlardı |
| `runtime = "edge"` (OG görselinde) | `next start` altında chunk çözemiyor, **tüm site 500 veriyordu** |

**EKLENENLER:** `FAQPage` yapısal verisi (sayfa metniyle tek kaynaktan),
`MobileApplication` + `Organization` + `WebSite` grafiği, kodla üretilen
1200×630 OG görseli, tüm rotalarda `canonical`.

### 2026-09-05 · Çok dillilik altyapısı (TR + EN)

Rota ağacı `app/[locale]/` altına taşındı; kök layout artık orada.
Türkçe ön eksiz kaldı — `/tr/...`'ye taşımak Play'e bildirilen bağlantıları
kırar ve birikmiş indeks sinyallerini sıfırlardı.

EN metinleri mağaza kaydının resmî İngilizce listing'inden alındı.
`e2e/i18n.spec.ts` ile 12 sözleşme testi eklendi.

---

## F. OTURUM AÇILIŞ PROTOKOLÜ

```
STEP 0  Bu dosya zaten yüklendiyse tekrar okuma.
STEP 1  Ürün gerçeği gerekiyorsa: layar/docs/PLAY-CONSOLE-YAYIN-DOSYASI.md §9
        (mağaza metinleri) ve layar/CLAUDE.md §A-B (çekirdek döngü).
STEP 2  Metin değiştireceksen önce lib/i18n/dictionaries/tr.ts.
STEP 3  Bitirmeden önce üç kapı: tsc --noEmit, npm run build, playwright test.
```

### Doğrulama komutları

```bash
npx tsc --noEmit && npm run build && npx playwright test
```

**Uyarı:** Playwright `npm run dev` çalıştırır ve `.next` klasörünü **dev**
çıktısıyla doldurur. Ardından `next start` çalıştırırsan
`Cannot find module './124.js'` alırsın. Çözüm: `rm -rf .next && npm run build`.

---

## G. AÇIK İŞLER

- **`/` ve `/home` hâlâ yakın içerik.** İkisini birleştirmek en büyük kalan SEO
  kazancı; ama keşif deneyiminin nereye konacağı bir ürün kararıdır.
- **Sosyal hesap yok** → yapısal veride `sameAs` boş. Hesaplar açılınca
  `lib/i18n/index.ts` içindeki `buildJsonLd`'ye eklenir.
- **App Store yayında değil** → `STORES.appStore` `null`. Yayınlanınca tek
  satır değişir.
- **Yasal metinler taslak seviyesinde.** Gizlilik/kullanım koşulları gerçek
  hukuki metinle değiştirilmeli; şu anki içerik yapıyı doğru kuruyor ama
  hukuki inceleme görmedi.
- **Sayfaya özel OG görseli yok** — hepsi kök görseli miras alıyor.
