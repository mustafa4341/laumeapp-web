# Laume SEO, GEO ve Google ölçüm kurulumu

Bu dosya, kod tarafındaki hazırlık tamamlandıktan sonra Google hesaplarında bir
kez yapılması gereken işlemleri anlatır. Sıralama garantisi vermez; ölçülebilir,
Google'ın yönergelerine uygun bir büyüme sistemi kurar.

## 1. Google Search Console

1. `https://search.google.com/search-console` adresini aç.
2. **Mülk ekle → Alan adı** seçeneğini seç ve yalnızca `laumeapp.com` yaz
   (`https://` veya `www` ekleme). Global kurulumda Domain property tercih
   edilir; tüm protokolleri ve alt alan adlarını tek raporda toplar.
3. Google'ın verdiği DNS TXT kaydını alan adının DNS paneline ekle. Alan adı
   Vercel DNS kullanıyorsa: Vercel → Domains → `laumeapp.com` → DNS Records →
   Type `TXT`, Name `@`, Value Google'ın verdiği `google-site-verification=...`
   değeri.
4. Doğrulama tamamlanınca **Dizin oluşturma → Site haritaları** bölümünde
   `https://laumeapp.com/sitemap.xml` adresini gönder.
5. **URL Denetimi** ile sırasıyla `/home`, `/ideas`, `/download`, `/about` ve
   `/support/faq` sayfalarında “Dizine eklenmesini iste” işlemini kullan.

DNS erişimi yoksa `https://laumeapp.com` için ayrıca bir **URL-prefix** mülkü
oluşturup HTML etiketi yöntemi kullanılabilir. Search Console'ın verdiği
`content` değerini dağıtım ortamında `GOOGLE_SITE_VERIFICATION` olarak ekle ve
yeniden deploy et. Kod bu değeri `<meta name="google-site-verification">`
etiketine dönüştürür.

## 2. Google Analytics 4

1. `https://analytics.google.com` içinde **Yönetici → Oluştur → Mülk** seç.
2. Global raporların ülkelere göre tutarlı gün sınırları kullanması için saat
   dilimini `UTC`, varsayılan para birimini `USD` olarak ayarla.
3. **Veri akışları → Web** bölümünde `https://laumeapp.com` için akış oluştur.
4. Verilen `G-...` ölçüm kimliğini Vercel Production ortamında
   `NEXT_PUBLIC_GA_MEASUREMENT_ID` değişkenine ekle ve yeniden deploy et.
5. Sitede analitik iznine onay verip birkaç sayfa gez; GA4 **Gerçek zamanlı**
   raporunda kendi ziyaretini doğrula.

Kod; sayfa görüntülemelerini, indirme çağrılarını ve keşif hunisi olaylarını
gönderir. Reklam depolaması ve kişiselleştirme kapalıdır. Analitik yalnız
ziyaretçi izin verdiğinde çerezli ölçüm yapar.

## 3. Search Console ile Analytics bağlantısı

GA4 içinde **Yönetici → Ürün bağlantıları → Search Console bağlantıları**
üzerinden doğrulanmış `laumeapp.com` mülkünü web veri akışına bağla. Böylece:

- Search Console: ülke/dil bazında sorgu, gösterim, tıklama, ortalama konum ve AI arama görünürlüğü
- GA4: kullanıcı, oturum, sayfa ve dönüşüm davranışı

aynı büyüme çalışmasında birlikte okunabilir.

## 4. Her ay izlenecek göstergeler

- Marka dışı sorgulardan gelen gösterim ve tıklamalar
- Ülke, dil ve cihaz bazında organik büyüme
- `/ideas` ve `/home` için sorgu bazında ortalama konum
- Organik aramadan gelen kullanıcı ve etkileşimli oturum sayısı
- `web_home_cta_clicked` ve `web_download_cta_clicked` olayları
- İndekslenmeyen sayfalar ve Core Web Vitals sorunları
- Search Console'daki üretken AI/AI görünürlüğü raporu

İlk anlamlı eğilim için genellikle birkaç hafta veri gerekir. Her hafta başlık
değiştirmek yerine gerçek sorgu verisi biriktirilmeli; yeni içerik yalnız
Laume'ın ürün deneyimiyle gerçekten ilişkili bir kullanıcı ihtiyacını
karşılıyorsa eklenmelidir.

## 5. GEO yaklaşımı

Google, AI sonuçları için ayrı bir “GEO etiketi” istemez. İndekslenebilir,
özgün ve kullanıcıya yararlı sayfalar aynı zamanda AI sonuçlarının temelidir.
Bu projede ürün varlığı tek isim, tek açıklama ve tutarlı gerçeklerle
`Organization`, `WebSite` ve `MobileApplication` yapılandırılmış verilerinde
tanımlanır. `public/llms.txt`, Google sıralama sinyali değildir; diğer AI
sistemlerine kısa ve doğrulanabilir bir ürün özeti sağlamak için tutulur.
