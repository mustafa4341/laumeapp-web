/**
 * TÜRKÇE SÖZLÜK — REFERANS DİL
 *
 * `Dictionary` tipi bu dosyadan türetilir (`lib/i18n/index.ts`). Yani buraya
 * eklenen her anahtar, diğer dillerde de zorunlu hâle gelir ve eksik çeviri
 * derleme hatası verir. Yeni metin eklerken önce buraya yaz.
 *
 * SEO metinleri Play Console mağaza kaydıyla aynı konumlandırmayı anlatır
 * (kaynak: layar deposu `docs/PLAY-CONSOLE-YAYIN-DOSYASI.md` §9).
 */
const tr = {
  /** Arama motoru ve paylaşım metinleri. */
  seo: {
    siteName: "Laume",
    titleTemplate: "%s | Laume",
    /** Mağaza kaydındaki uygulama adı. */
    appName: "Laume: A letter waits for you",
    tagline: "Bir mektup seni bekliyor.",
    description:
      "Laume, gerçek yerlere metin, fotoğraf ve sesli mektuplar bırakabileceğin konuma bağlı keşif uygulamasıdır. " +
      "Mühürler yalnızca 50 metreye yaklaştığında açılır.",
    socialDescription:
      "Gerçek bir yere mektup bırak. Haritadaki mührü bul; 50 metreye yaklaşınca aç.",
    keywords: [
      "Laume",
      "Laume uygulama",
      "konuma mektup bırakma",
      "gerçek yere mektup bırakma",
      "konum tabanlı mektup uygulaması",
      "mühürlü mektup uygulaması",
      "yere bırakılan not",
      "keşif uygulaması",
      "mekâna bağlı mesajlaşma",
      "laumeapp",
    ],
  },

  /** Ortak site iskeleti. */
  common: {
    skipToContent: "İçeriğe geç",
    languageSwitcherLabel: "Dil seç",
    backToTop: "Yukarı dön",
  },

  nav: {
    ariaLabel: "Ana menü",
    home: "Ana Sayfa",
    download: "İndir",
    about: "Hakkında",
    support: "Destek",
    legal: "Yasal",
  },

  footer: {
    blurb: "Gerçek yerlere mektuplar bırak. Yalnızca oraya gidenlerin açabildiği hikâyeleri keşfet.",
    navHeading: "Gezinme",
    supportHeading: "Destek & Yardım",
    legalHeading: "Yasal & Güvenlik",
    discovery: "Keşif",
    productHome: "Ürün Ana Sayfası",
    downloadCenter: "İndirme Merkezi",
    about: "Hakkında",
    supportCenter: "Destek Merkezi",
    faq: "Sıkça Sorulan Sorular",
    contact: "İletişim",
    legalCenter: "Yasal Merkez",
    privacy: "Gizlilik Politikası",
    terms: "Kullanım Koşulları",
    community: "Topluluk Kuralları",
    cookies: "Çerez Politikası",
    refunds: "İade Politikası",
    deleteAccount: "Hesabı Sil",
    rights: "Tüm hakları saklıdır.",
    domainTagline: "laumeapp.com — A letter waits for you",
  },

  /** Keşif sahnesi (kök sayfa). */
  discovery: {
    metaTitle: "Laume: A letter waits for you",
    arrivalTitle: "Burada bir şey var.",
    arrivalSub: "Hareket et.",
    traceTitle: "Bir iz.",
    traceSub: "Takip et.",
    fragmentTitle: "Bir şey düşürmüş.",
    fragmentSub: "İz devam ediyor.",
    fragmentQuote: "…senin bulacağını biliyordum…",
    approachingSub: "yaklaşıyorsun",
    nearSub: "yakın.",
    foundTitle: "Buldun.",
    holdSub: "Basılı tut.",
    pullSub: "Yukarı çek.",
    letterTitle: "Bu sadece ilkiydi.",
    letterBody: "Birileri, bir yerde, senin bulman için bir şey bıraktı.",
    continuationTitle: "Yakınında başka ne var?",
    continuationCta: "Bulmaya devam et →",
    continuationHint: "Uygulamayı açar",
    skip: "Keşfi geç",
    audioOn: "Sesi kapat",
    audioOff: "Sesi aç",
    letterAria: "Mektubu yukarı çek",
    sealAria: "Mührü kırmak için basılı tut",
    letterRegionAria: "Bulunan mektup",
    sealReadySub: "Şimdi aç.",
    skipTitle: "Keşif deneyimini atla ve ana sayfaya git (Esc)",
    sealHelp:
      "Mührü kırmak için boşluk veya enter tuşunu basılı tut. Ardından mektubu yukarı ok tuşuyla çek.",
    /** Boşta kalınca beliren yardım ipuçları. */
    hints: {
      moveMouse: "İmleci ekranda gezdir.",
      moveFinger: "Parmağını ekranda gezdir.",
      followTrail: "İzi takip et.",
      holdSealMouse: "Mühre basılı tut.",
      holdSealFinger: "Mühre parmağını basılı tut.",
    },
    /** Ekran okuyucuya iletilen durum bildirimleri (aria-live). */
    announce: {
      trace: "Bir iz bulundu.",
      fragment: "Yırtık bir kâğıt parçası: senin bulacağını biliyordum.",
      near: "Hedefe yaklaştın.",
      sealReady: "Bir zarf buldun. Mührü açmak için basılı tut.",
      letterPull: "Mühür açıldı. Mektubu yukarı çek.",
      letterRead:
        "Mektup açıldı: Bu sadece ilkiydi. Birileri, bir yerde, senin bulman için bir şey bıraktı.",
      continuation: "Yakınında başka ne var? Bulmaya devam et.",
    },
  },

  home: {
    metaTitle: "Laume — Konuma Bağlı Mektuplar ve Yerel Keşif",
    metaDescription:
      "Laume ile gerçek konumlara metin, fotoğraf ve sesli mektup bırak. Haritadaki mühürleri bul; 50 metreye yaklaşınca aç.",
    experience: {
      nav: {
        story: "Nasıl işler",
        seals: "Mühürler",
        trust: "Güven",
        download: "Uygulamayı indir",
        downloadShort: "İndir",
      },
      hero: {
        eyebrow: "Konuma bağlı mektuplar",
        title: "Bir mektup seni bekliyor.",
        body: "Laume'da mektuplar bir gelen kutusuna değil, gerçek yerlere bırakılır. Haritadaki mührü bul, 50 metreye yaklaş ve hikâyeyi ait olduğu yerde aç.",
        primary: "Nasıl çalıştığını gör",
        secondary: "Giriş ritüelini yeniden yaşa →",
        note: "Metin, fotoğraf veya ses. Her mektubun bir yeri var.",
        scrollAria: "Laume hikâyesine ilerle",
        imageAlt: "Paris manzarasında Eyfel Kulesi, mühürlü bir mektup ve farklı mektup türlerini gösteren Laume ekranı",
      },
      promise: {
        eyebrow: "Nasıl çalışır",
        title: "Mührü gör. Yolu bul. Mektubu aç.",
        body: "Uygulamayı açtığında yakındaki mühürleri görürsün. İçerik gizli kalır; yalnızca o noktaya yürüyen kişi okuyabilir.",
        steps: [
          { title: "Haritada bul", body: "Yakındaki mektuplar haritada mühür olarak görünür." },
          { title: "50 metreye yaklaş", body: "Mesafe azaldıkça mühür açılmaya hazır olur." },
          { title: "Yerinde oku", body: "Mührü kır; metni, fotoğrafı veya sesli mektubu keşfet." },
        ],
      },
      istanbul: {
        city: "İstanbul, Türkiye",
        eyebrow: "Anı Noktası",
        title: "Bir yerin ortak anı defteri.",
        body: "Anı Noktası, aynı yere gelen insanların kısa notlarını bıraktığı ortak bir defterdir. Yalnızca oraya gidenler yeni bir sayfa ekleyebilir.",
        detail: "Uzaktan yazılmaz. Her sayfa gerçek bir ziyaretten gelir.",
        imageAlt: "İstanbul Ortaköy kıyısında bir Anı Noktası ve aynı yere bırakılmış anılar",
      },
      journey: {
        eyebrow: "Taşınan mektup",
        title: "Bir mektup şehir değiştirebilir.",
        body: "Taşınan Mektup'u bul, yanında götür ve başka bir gerçek yere bırak. Yeni konumu, mektubun yolculuğuna eklenir.",
      },
      kyoto: {
        city: "Kyoto, Japonya",
        eyebrow: "Zaman Kapsülü",
        title: "Bir güne ve bir yere kilitle.",
        body: "Zaman Kapsülü'nü gerçek bir konuma ve gelecekteki bir tarihe mühürle. Hem doğru yere hem doğru zamana gelmeden açılmaz.",
        detail: "Doğru yer. Doğru zaman. Tek bir açılma anı.",
        imageAlt: "Kyoto'da sakura ağaçlı bir sokakta zaman kapsülü mühürlü mektup ve cep saati",
      },
      seals: {
        eyebrow: "Harita işaretleri",
        title: "Haritadaki her mühür başka çalışır.",
        body: "Mührün rengi ve simgesi, seni nasıl bir deneyimin beklediğini gösterir. İçeriği ise ancak oraya vardığında görürsün.",
        items: [
          { symbol: "✉", title: "Mektup", body: "Bulunduğu yerde açılan kişisel bir mesaj." },
          { symbol: "↗", title: "Taşınan Mektup", body: "Bir kişi tarafından başka bir konuma taşınabilen yolcu hikâye." },
          { symbol: "○", title: "Anı Noktası", body: "Aynı yere gelenlerin ortak anı defteri." },
          { symbol: "⌛", title: "Zaman Kapsülü", body: "Belirlenen tarih gelene kadar kapalı kalan mektup." },
        ],
      },
      trail: {
        eyebrow: "İz Haritan",
        title: "Keşfettiklerin tek haritada.",
        body: "İz Haritan; açtığın mektupları, ziyaret ettiğin Anı Noktalarını ve şehirlerde bıraktığın izleri bir araya getirir.",
        points: ["Açtığın mektupları yeniden bul", "Şehirlerde bıraktığın izleri gör", "Kendi keşif hafızanı büyüt"],
        imageAlt: "Laume mobil uygulamasında Miami üzerindeki İngilizce İz Haritan ekranı",
      },
      trust: {
        eyebrow: "Güvenli keşif",
        title: "Konumunu paylaşmadan keşfet.",
        body: "Laume konumunu yalnızca uygulama açıkken mesafeyi hesaplamak için kullanır. Haritada görünen sen değil, mektuptur.",
        items: [
          { title: "Konumun sana ait", body: "Konum yalnızca uygulama açıkken mesafeyi doğrulamak için kullanılır; arka planda takip edilmez." },
          { title: "Güvenli noktalar", body: "Özel mülk, trafik ve erişimi tehlikeli alanlar keşif noktası olarak kabul edilmez." },
          { title: "Topluluk kontrolü", body: "Uygunsuz içerikler uygulama içinden bildirilebilir ve incelenir." },
        ],
      },
      faq: {
        eyebrow: "Merak edilenler",
        title: "Kısa cevaplar.",
        body: "Mektuplar, konum izni ve 50 metre kuralı hakkında en çok sorulanlar.",
        more: "Tüm soruları gör →",
        items: [
          { q: "Bir mektup ne zaman açılır?", a: "Mektubun bırakıldığı noktaya 50 metre yaklaştığında mühür açılabilir hâle gelir." },
          { q: "Uzaktan okuyabilir miyim?", a: "Hayır. Laume'da içeriğe ulaşmanın koşulu, bırakıldığı gerçek yere gitmektir." },
          { q: "Konumum sürekli izlenir mi?", a: "Hayır. Konum, uygulama açıkken mesafe kontrolü için kullanılır; arka plan konumu istenmez." },
        ],
      },
      final: {
        eyebrow: "İlk keşfin",
        title: "İlk mektup yakınında olabilir.",
        body: "Yayın durumunu ve desteklenen cihazları indirme sayfasında görebilirsin.",
        primary: "İndirme sayfasına git",
        secondary: "Destek merkezini aç →",
      },
    },
    /** Ana sayfa bileşenlerinin metinleri. */
    hero: {
      eyebrow: "Konum temelli mektup keşfi",
      title: "Bazı şeyler bulunmak için bırakılır.",
      body:
        "Laume, bir yere bırakılan mektupları yalnızca oraya gerçekten giden insanların keşfedebildiği sessiz bir deneyimdir.",
      cta: "Keşfetmeye başla",
      replay: "Keşfi yeniden yaşa →",
      mapLabel: "İz haritan",
      sectionAria: "Laume tanıtım girişi",
      steps: [
        { num: "01", label: "Bırak" },
        { num: "02", label: "Yaklaş" },
        { num: "03", label: "Keşfet" },
      ],
    },
    intro: {
      sectionAria: "Ürün felsefesi",
      eyebrow: "Ürün felsefesi",
      title: "Kelimeler neden yazıldıkları yere ait olmalı?",
      p1:
        "Modern internet her mesajı anında her yere ulaştırdı. Ancak bu hız, sözcüklerin ağırlığını ve bırakıldıkları yerin duygusunu azalttı. Bir sahil rüzgârında ya da eski bir sokakta yazılan not, dünyanın başka bir köşesindeki bildirim ekranında aynı hissi taşıyamaz.",
      p2:
        "Laume kelimeleri tekrar fiziksel mekâna kilitler. Bir mektup yalnızca bırakıldığı yerde, oraya fiziksel olarak yaklaşan biri tarafından açılabilir.",
      pillars: [
        { title: "Mekân hafızası", body: "Gerçek koordinatlara bırakılan kalıcı dijital izler." },
        { title: "50 metre kuralı", body: "Mührün kırılması için oraya fiziksel olarak yürünmelidir." },
        { title: "Sessiz keşif", body: "Algoritma gürültüsü, beğeni yarışı veya sahte aktivite yok." },
      ],
    },
    howCards: [
      { title: "Bırak", body: "Bir düşünceyi gerçek bir yere bırak." },
      { title: "Yaklaş", body: "İzler yalnız yaklaştığında görünür." },
      { title: "Keşfet", body: "Mührü aç ve sana bırakılanı oku." },
    ],
    cta: {
      sectionAria: "İndirme ve destek çağrısı",
      eyebrow: "Hemen başla",
      title: "Laume ile keşfe adım at.",
      body: "Yakınındaki mühürleri bul, kendi hikâyeni şehre bırak.",
    },
    heroTitle: "Bir mektup seni bekliyor.",
    heroBody:
      "Sevdiğin bir bankın yanına, ilk buluştuğunuz köşeye, denize bakan o duvara bir mektup bırakırsın. O mektup orada kalır. Onu okumanın tek bir yolu vardır: oraya gitmek.",
    heroCta: "Laume'ı indir",
    heroSecondary: "Nasıl çalışır?",
    introHeading: "İçerik akmaz. Bir yerde durur ve seni bekler.",
    introBody:
      "Sosyal uygulamalar seni ekrana bağlar. Laume dışarı çıkarır. Bir mektubu görmek için gerçekten o sokaktan geçmen gerekir. Bu yüzden Laume'da okunan her şey kazanılmıştır.",
    howHeading: "Nasıl çalışır",
    steps: [
      {
        title: "Bir yere git ve mektubunu bırak",
        body: "Metin, fotoğraf, istersen sesli bir fısıltı.",
      },
      {
        title: "Mektup o koordinata mühürlenir",
        body: "Artık o yerin bir parçası.",
      },
      {
        title: "Başka biri oradan geçer",
        body: "Haritada mühürlü bir iz görür.",
      },
      {
        title: "50 metreye yaklaşınca mühür açılır",
        body: "Ne bir metre fazlası, ne eksiği.",
      },
      {
        title: "Okunan her mektup arşive işlenir",
        body: "Kendi keşif haritanı doldurursun.",
      },
    ],
    ctaHeading: "Yakınında bir mektup olabilir.",
    ctaBody: "Laume ücretsiz. Plus, Pro ve mektup kredileri isteğe bağlıdır.",
  },

  about: {
    metaTitle: "Laume Nedir? Mektubun Bir Yere Ait Olması",
    metaDescription:
      "Sosyal uygulamalar seni ekrana bağlar, Laume dışarı çıkarır. İçerik akmaz; bir yerde durur ve seni bekler. Laume'ın manifestosu ve arkasındaki fikir.",
    heading: "Hakkında",
  },

  download: {
    metaTitle: "Laume'ı İndir — Android ve iOS",
    metaDescription:
      "Laume'ı Google Play'den indir. Ücretsiz kullanılır; Plus, Pro ve mektup kredileri isteğe bağlıdır. Android 10 ve iOS 15 ve üzeri desteklenir.",
    heading: "Laume'ı indir",
    googlePlay: "Google Play'den indir",
    appStore: "App Store (çok yakında)",
    requirements: "Android 10 (API 29) ve üzeri · iOS 15.0 ve üzeri",
  },

  support: {
    metaTitle: "Destek Merkezi",
    metaDescription:
      "Laume ile ilgili sorular, 50 metre kuralı, konum izinleri, hesap silme ve iletişim kanalları.",
    heading: "Destek Merkezi",
    faqCta: "Sıkça sorulan sorular",
    contactCta: "Bize ulaş",
  },

  faq: {
    metaTitle: "Sıkça Sorulan Sorular",
    metaDescription:
      "Mektup neden uzaktan açılmıyor, 50 metre kuralı nasıl işler, konum arka planda takip edilir mi, hesap nasıl silinir — en çok sorulanlar.",
    eyebrow: "Laume Bilgi Bankası",
    heading: "Sıkça Sorulan Sorular",
    lede: "Laume deneyimi, konum izinleri ve mektup dinamikleri hakkında merak edilenler.",
    deleteAccountLink: "Hesap silme sayfası",
    contactCta: "Cevap bulamadınız mı? Bize ulaşın →",
    backCta: "Destek merkezine dön",
    items: [
      {
        q: "Bir mektubu neden bulunduğum yerden açamıyorum?",
        a: "Laume'ın temel ilkesi mekânsal gerçekliktir. Bir mektup, yazarının bıraktığı fiziksel konuma 50 metre yaklaşılmadıkça kilitli kalır. Cihazınızın konum servislerinin açık ve “Hassas Konum” iznine sahip olduğundan emin olun.",
      },
      {
        q: "Mühür nasıl açılır?",
        a: "Mektubun bırakıldığı noktaya 50 metre yaklaştığınızda ekranda balmumu mühür belirir. Mührü kırdığınızda zarf açılır ve mektup okunabilir hâle gelir. 50 metrenin dışındayken mühür açılmaz; ekran kalan mesafeyi gösterir.",
      },
      {
        q: "Konumum sürekli takip ediliyor mu?",
        a: "Hayır. Laume konumunuzu yalnızca uygulama açıkken, mesafe hesaplamak için işler. Uygulama arka plan konum iznini hiç istemez ve kesintisiz konum geçmişiniz saklanmaz. Haritada görünen şey sizin nerede olduğunuz değil, mektubun nerede olduğudur.",
      },
      {
        q: "Hesabımı ve bıraktığım mektupları nasıl silebilirim?",
        a: "Hesabınızı ve mektup geçmişinizi mobil uygulama ayarlarından (Ayarlar > Hesap > Hesabı sil) veya web üzerindeki hesap silme sayfasından dilediğiniz an silebilirsiniz.",
      },
      {
        q: "Hangi cihazlar destekleniyor?",
        a: "Laume, iOS 15.0 ve üzeri iPhone modelleri ile Android 10 (API 29) ve üzeri Android cihazlarda GPS donanımıyla çalışır.",
      },
    ],
  },

  contact: {
    metaTitle: "İletişim",
    metaDescription:
      "Laume destek ekibine ulaş: teknik yardım, hesap sorunları, içerik bildirimi ve geri bildirim.",
    heading: "İletişim",
    emailLabel: "Destek e-postası",
  },

  legal: {
    metaTitle: "Yasal Merkez",
    metaDescription:
      "Laume kullanım koşulları, gizlilik politikası, topluluk kuralları, çerez ve iade politikaları.",
    heading: "Yasal Merkez",
    privacy: {
      metaTitle: "Gizlilik Politikası",
      metaDescription:
        "Konumun yalnızca uygulama açıkken kullanılır; arka plan konum izni hiç istenmez. Haritada görünen sen değil, bıraktığın mektuptur.",
    },
    terms: {
      metaTitle: "Kullanım Koşulları",
      metaDescription:
        "Laume mobil uygulaması ve web platformunun kullanım koşulları, hesap kuralları ve sorumluluk sınırları.",
    },
    community: {
      metaTitle: "Topluluk Kuralları",
      metaDescription:
        "Bir mektup gerçek bir yere bırakılır; o yer başkasının da yaşadığı yerdir. Laume'da güvenli ve saygılı keşif için kurallar.",
    },
    cookies: {
      metaTitle: "Çerez Politikası",
      metaDescription:
        "Laume web sitesinde yalnızca teknik ve zorunlu çerezler kullanılır. Reklam veya profilleme çerezi yoktur.",
    },
    refunds: {
      metaTitle: "İade Politikası",
      metaDescription:
        "Laume Plus, Pro abonelikleri ve mektup kredileri için uygulama içi satın alma ve iade prosedürleri.",
    },
  },


  /** Sayfa gövdeleri. Metadata ile aynı yerde durur ki çeviri bölünmesin. */
  pages: {
    about: {
      heading: "LAUME Hakkında",
      lede: "Dijital dünyanın unuttuğu mekân hissini geri getiriyoruz.",
      manifestoHeading: "Manifesto",
      manifestoP1:
        "İnternet her şeyi her an erişilebilir hâle getirdiğinde, kelimelerin değeri azaldı. Herhangi bir yerden herhangi bir mesaja ulaşabilmek, mesajın bırakıldığı yerin anlamını yok etti.",
      manifestoP2:
        "Laume kelimeleri tekrar fiziksel dünyaya kilitliyor. Bir mektup yalnızca yazıldığı tepede, dinlendiği kıyıda ya da unutulduğu sokakta okunabilir.",
      principlesHeading: "İlkelerimiz",
      principles: [
        { title: "Dürüst keşif", body: "Sahte kullanıcı, sahte sayaç, kandırmaca yok." },
        { title: "Mekân hafızası", body: "Kelimeler ancak fiziksel konumlarıyla anlam kazanır." },
        { title: "Gizlilik", body: "Konumun yalnızca mesafe kontrolü için, uygulama açıkken kullanılır." },
      ],
    },
    download: {
      heading: "Laume'ı indir",
      lede: "Laume mağazalarda yerini almaya hazırlanıyor. Desteklenen cihazları ve güncel yayın durumunu burada görebilirsin.",
      playHeading: "Google Play",
      playBody: "Android 10 (API 29) ve üzeri cihazlar için hazırlanıyor.",
      appStoreHeading: "Apple App Store",
      appStoreBody: "iOS 15.0 ve üzeri iPhone cihazlar için hazırlanıyor.",
      comingSoon: "Yayın hazırlığında",
    },
    support: {
      heading: "Destek Merkezi",
      lede: "Laume ile ilgili sorular, hata bildirimleri ve teknik destek için buradayız.",
      quickHeading: "Hızlı bağlantılar",
      emailHeading: "Doğrudan e-posta",
      emailBody: "Her türlü soru ve hesap işlemi için resmî destek adresimiz:",
      deleteHeading: "Hesap ve veri silme",
      deleteBody:
        "Hesabını ve tüm mektup verilerini uygulama içinden Ayarlar → Hesap → Hesabı sil yolundan silebilirsin.",
      deleteCta: "Hesap silme sayfası →",
    },
    contact: {
      heading: "İletişim",
      lede: "Teknik yardım, hesap sorunları, içerik bildirimi ve geri bildirim için bize yaz.",
      emailHeading: "Destek e-postası",
      responseNote: "Mesajlar iş günlerinde yanıtlanır.",
    },
    legal: {
      heading: "Yasal Merkez",
      lede: "Sözleşmeler, veri güvenliği standartları ve kullanım şartları.",
      cards: [
        { title: "Gizlilik Politikası", body: "Konum, hesap ve kişisel verilerinin nasıl korunduğu." },
        { title: "Kullanım Koşulları", body: "Hizmet şartları, telif hakları ve kullanıcı yükümlülükleri." },
        { title: "Topluluk Kuralları", body: "Mektup bırakırken uyulması gereken etik ve güvenlik standartları." },
        { title: "Çerez Politikası", body: "Web sitesinde kullanılan teknik çerezler." },
        { title: "İade Politikası", body: "Uygulama içi satın alımlar ve abonelik iptal süreçleri." },
        { title: "Hesabı Sil", body: "Google Play ve Apple zorunlu hesap silme bilgilendirmesi." },
      ],
      backCta: "← Yasal merkeze dön",
      lastUpdatedLabel: "Son güncelleme",
      lastUpdated: "4 Eylül 2026",
      privacyBody: {
        collectHeading: "Topladığımız veriler",
        collectItems: [
          { title: "Hesap bilgileri", body: "E-posta adresi, kullanıcı adı ve profil bilgileri." },
          { title: "Konum verisi", body: "Mektup bırakma ve mühür açma işlevleri için cihaz konumun, yalnızca ilgili işlem sırasında ve açık iznin ile kullanılır. Arka plan konum izni hiç istenmez." },
          { title: "Kullanıcı içeriği", body: "Oluşturduğun mektup metinleri, fotoğraflar ve ses kayıtları." },
          { title: "Kullanım verisi", body: "Hata kayıtları, uygulama içi etkileşimler ve işletim sistemi sürümü." },
        ],
        useHeading: "Verileri nasıl kullanıyoruz",
        useBody:
          "Toplanan veriler yalnızca mektup mesafesini doğrulamak, hesap güvenliğini sağlamak ve hizmet kalitesini artırmak için işlenir. Kişisel verilerin hiçbir üçüncü tarafa satılmaz.",
      },
    },
  },


  /**
   * Yasal sayfa gövdeleri ortak bir şekle sahiptir: başlık + giriş + bölümler.
   * Böylece hepsi tek bir bileşenle (components/legal/LegalArticle) render
   * edilir ve yeni dil eklerken yalnız metin yazılır, JSX kopyalanmaz.
   */
  legalBodies: {
    terms: {
      heading: "Kullanım Koşulları",
      lede: "Laume platformunu ve mobil uygulamasını kullanarak bu koşulları kabul etmiş sayılırsın.",
      sections: [
        {
          heading: "Hizmetin niteliği",
          body: "Laume, kullanıcıların gerçek konumlara dijital içerik bırakmasını ve bu içerikleri keşfetmesini sağlayan bir platformdur. Kullanıcılar bıraktıkları içeriğin doğruluğundan ve yasallığından bizzat sorumludur.",
        },
        {
          heading: "Yasaklı eylemler",
          body: "Özel mülk ihlali, başkalarının güvenliğini tehlikeye atan yerlere mektup bırakma, tehdit, hakaret veya zararlı içerik yayma kesinlikle yasaktır ve hesap kapatılmasıyla sonuçlanır.",
        },
        {
          heading: "Güvenlik",
          body: "Bir mektuba ulaşmak için trafiğe, özel mülke, tehlikeli veya girilmesi yasak alanlara girme. Araç kullanırken uygulamayı kullanma.",
        },
      ],
    },
    cookies: {
      heading: "Çerez Politikası",
      lede: "Web sitesinde gizliliğine azami özen gösterilir.",
      sections: [
        {
          heading: "Kullandığımız çerezler",
          body: "Web sitesi yalnızca oturum tercihleri (keşfi tamamlama durumu, ses tercihi, dil seçimi) için zorunlu teknik yerel depolama verilerini kullanır.",
        },
        {
          heading: "Kullanmadıklarımız",
          body: "Üçüncü taraf reklam veya profilleme çerezi kullanılmaz.",
        },
      ],
    },
    community: {
      heading: "Topluluk Kuralları",
      lede: "Bir mektup gerçek bir yere bırakılır; o yer başkasının da yaşadığı yerdir.",
      sections: [
        {
          heading: "Mekâna saygı",
          body: "Özel mülke, ibadet yerlerine, tehlikeli veya girişi yasak alanlara mektup bırakma. Bıraktığın yer, oraya gelecek kişinin güvenle durabileceği bir yer olmalı.",
        },
        {
          heading: "Kişilere saygı",
          body: "Tehdit, taciz, nefret söylemi, kişisel bilgi ifşası ve başkasının rızası olmadan paylaşılan içerik yasaktır.",
        },
        {
          heading: "Bildirim",
          body: "Kurallara aykırı bir mektupla karşılaşırsan uygulama içinden bildir; her bildirim incelenir.",
        },
      ],
    },
    refunds: {
      heading: "İade Politikası",
      lede: "Plus, Pro abonelikleri ve mektup kredileri için satın alma ve iade süreçleri.",
      sections: [
        {
          heading: "Abonelikler",
          body: "Abonelikler Google Play hesabından yönetilir ve istediğin an iptal edilebilir. İptal, dönem sonuna kadar erişimi sürdürür.",
        },
        {
          heading: "İade talepleri",
          body: "İadeler mağaza sağlayıcısının (Google Play) kendi iade politikasına tabidir. Talebini önce mağaza üzerinden iletmelisin.",
        },
        {
          heading: "Mektup kredileri",
          body: "Kullanılmış mektup kredileri iade edilemez; kullanılmamış krediler için destek ekibiyle iletişime geç.",
        },
      ],
    },
  },

  letter: {
    invalidTitle: "Geçersiz mektup",
    metaTitlePrefix: "Mektup",
    metaDescription:
      "Bu mektup fiziksel dünyada bir yere bırakıldı. Tamamını okumak için fiziksel olarak yakınına gitmelisin.",
    bridgeEyebrow: "Laume derin bağlantı köprüsü",
    sealTitlePrefix: "Laume mührü",
    sealDescription:
      "Bu konuma bırakılmış bir Laume mektubu sizi bekliyor. Uygulamada açarak mührü kırın.",
    openInApp: "Uygulamada aç",
    downloadCta: "Laume'ı indir",
    bridgeConnecting: "LAUME uygulamasına bağlanılıyor…",
    bridgeFallback:
      "LAUME uygulaması otomatik açılmadıysa aşağıdaki düğmeyle doğrudan açabilir veya uygulamayı indirebilirsin.",
    previewQuote: "“Bu sadece bir mektup. LAUME’da gerisi seni bekliyor.”",
    privacyNoticeTitle: "Gizlilik ve konum koruması",
    privacyNoticeBody:
      "Bu mektubun tamamı ve saklandığı tam koordinat, yalnızca LAUME mobil uygulamasıyla fiziksel olarak 50 metre mesafeye yaklaşıldığında görüntülenebilir.",
    backHome: "← LAUME ana sayfasına dön",
  },

  /**
   * Şifre sıfırlama köprüsü (`/reset-password`). Supabase kurtarma e-postası
   * bu adrese `?code=…` ile döner; sayfa şifreyi DEĞİŞTİRMEZ, yalnız kullanıcıyı
   * boş ekranda bırakmaz ve kodu Laume uygulamasına taşır (kaynak: FIX-026).
   */
  resetPassword: {
    metaTitle: "Şifreni sıfırla",
    metaDescription:
      "Bu bağlantı Laume uygulamasında açılır; şifre sıfırlama adımını orada tamamlarsın.",
    heading: "Şifreni sıfırla",
    intro:
      "Bu bağlantı Laume uygulamasında açılır. Yeni şifreni uygulamadan belirleyeceksin.",
    openInApp: "Uygulamada aç",
    noAppHeading: "Uygulama telefonunda kurulu değil mi?",
    noAppBody: "Önce Laume'ı indir, sonra bu bağlantıya telefonundan yeniden dokun.",
    downloadCta: "Laume'ı indir",
    desktopNote:
      "Bilgisayardaysan bu bağlantıyı telefonundan açman gerekiyor. Şifre sıfırlama yalnızca Laume uygulamasında tamamlanır.",
    missingCodeNote:
      "Bu sayfa yalnızca şifre sıfırlama e-postandaki bağlantıyla açıldığında çalışır.",
  },
};

export default tr;
