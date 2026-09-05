# Android App Links — `assetlinks.json`

Bu dosya **şablondur, doğrulanmış bir bildirim değildir.** Parmak izi alanı
bilerek `REPLACE_WITH_PLAY_APP_SIGNING_SHA256_FINGERPRINT` yazıyor — uydurma
veya tahmini bir SHA-256 **yazılmayacak**. Yanlış bir parmak izi doğrulamayı
geçirmez, yalnız arızayı teşhis etmesi zor hâle getirir.

## Bugünkü davranış

`https://laumeapp.com/n/<id>` linkine dokunulduğunda Android doğrulama
başarısız olur ve link **tarayıcıda** açılır. Bu bir hata değil, beklenen
durumdur: sayfa zaten uygulamayı açmayı dener ve uygulama yoksa indirme
yoluna yönlendirir.

## Kapanış adımları (sırayla)

1. Play Console → **Setup → App signing** → **App signing key certificate**
   altındaki **SHA-256 certificate fingerprint** değerini kopyala.
   ⚠ Yerel debug keystore'un parmak izi DEĞİL — Play'in imzaladığı sürümünki.
2. Bu dosyadaki placeholder'ı o değerle değiştir.
3. Dağıt ve tarayıcıda **tam olarak** şu adresin 200 döndüğünü doğrula:
   `https://laumeapp.com/.well-known/assetlinks.json`
4. Gerçek bir Android cihazda paylaşım linkine dokun; uygulama açılmalı ve
   **doğru mektuba** gitmeli. Bu görülmeden `APP-LINK-PASS` yazılmaz.

## Sözleşme (uygulama tarafıyla eşleşmeli)

| Alan | Değer | Kaynak |
|---|---|---|
| `package_name` | `app.layar.mobile` | `layar` deposu → `frontend/app.json:45` |
| Host'lar | `laumeapp.com`, `www.laumeapp.com` | `frontend/app.json:66,71` |
| `autoVerify` | `true` | `frontend/app.json:62` |
| Yol ön eki | `/n` | `shared/utils/layarUrl.ts` (`NOTE_PATH`) |

Marka adı `Layar` → `Laume` olarak değişti; **paket adı bilerek değişmedi**.
İkisini karıştırma.

iOS `apple-app-site-association` V1 kapsamı dışıdır (Android-only, karar D-04).
