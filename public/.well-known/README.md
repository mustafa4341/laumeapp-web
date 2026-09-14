# App Links — `assetlinks.json` (Android) · `apple-app-site-association` (iOS)

Her iki dosya da **şablondur, doğrulanmış bir bildirim değildir.** Kimlik
alanları bilerek placeholder taşır — uydurma veya tahmini bir değer
**yazılmayacak**. Yanlış bir kimlik doğrulamayı geçirmez, yalnız arızayı
teşhis etmesi zor hâle getirir.

- Android: SHA-256 parmak izi alanı `REPLACE_WITH_PLAY_APP_SIGNING_SHA256_FINGERPRINT`.
- iOS: `appID` ön eki `APPLE_TEAM_ID` (10 karakterli Apple Team ID; Apple
  Developer → Membership → Team ID). Aynı değer `layar` deposunda
  `frontend/eas.json` → `appleTeamId` alanına da yazılmalı (şu an
  `APPLE_TEAM_ID_BURAYA` placeholder'ı).

## Bugünkü davranış

`https://www.laumeapp.com/n/<id>` veya `/reset-password` linkine dokunulduğunda
doğrulama başarısız olur ve link **tarayıcıda** açılır. Bu bir hata değil,
beklenen durumdur: sayfa zaten uygulamayı açmayı dener, uygulama yoksa indirme
yoluna yönlendirir.

⚠ `www` kasıtlı: `laumeapp.com` canlıda `www`'ye 308 ile yönlenir ve App Link
doğrulaması yönlendirme izlemez. Doğrulanabilen host `www`'dir.

## Kapanış adımları (sırayla)

### Android — `assetlinks.json`

1. Play Console → **Setup → App signing** → **App signing key certificate**
   altındaki **SHA-256 certificate fingerprint** değerini kopyala.
   ⚠ Yerel debug keystore'un parmak izi DEĞİL — Play'in imzaladığı sürümünki.
2. Bu dosyadaki placeholder'ı o değerle değiştir.
3. Dağıt ve tarayıcıda şu adresin 200 döndüğünü doğrula:
   `https://www.laumeapp.com/.well-known/assetlinks.json`
4. Gerçek bir Android cihazda paylaşım linkine dokun; uygulama açılmalı ve
   **doğru mektuba** gitmeli. Bu görülmeden `APP-LINK-PASS` yazılmaz.

### iOS — `apple-app-site-association`

1. Apple Developer → **Membership** → **Team ID** (10 karakterli) değerini kopyala.
2. `appID` içindeki `APPLE_TEAM_ID` placeholder'ını o değerle değiştir.
3. `layar` deposunda `frontend/eas.json` → `appleTeamId` alanını da aynı değere çek.
4. Dağıt ve doğrula: `https://www.laumeapp.com/.well-known/apple-app-site-association`
   **200**, **`Content-Type: application/json`**, gövde JSON (sitenin 404 HTML'i
   değil), adres **uzantısız**. Üçü de sağlanmadan `APP-LINK-PASS` yazılmaz.
5. Gerçek bir iOS cihazda şifre sıfırlama e-postasındaki bağlantıya dokun;
   uygulama açılmalı ve `code` parametresiyle sıfırlama ekranına gitmeli.

## Sözleşme (uygulama tarafıyla eşleşmeli)

| Alan | Değer | Kaynak |
|---|---|---|
| `package_name` (Android) | `app.layar.mobile` | `layar` deposu → `frontend/app.json:45` |
| `appID` (iOS) | `<TeamID>.app.layar.mobile` | Apple Developer + `frontend/eas.json` |
| Host'lar | `laumeapp.com`, `www.laumeapp.com` | `frontend/app.json:66,71` |
| `autoVerify` | `true` | `frontend/app.json:62` |
| Yollar | `/n/*`, `/reset-password` | `shared/utils/layarUrl.ts`, FIX-026 |

Marka adı `Layar` → `Laume` olarak değişti; **paket adı bilerek değişmedi**.
İkisini karıştırma.
