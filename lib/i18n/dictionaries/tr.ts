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
    appName: "Laume: Bir mektup bir yere ait",
    tagline: "Bir yere mektup bırak. Onu okumanın tek yolu oraya gitmek.",
    description:
      "Laume'da bir mektup bir yere aittir. Gerçek bir yere mektup bırakırsın; " +
      "onu okumanın tek yolu oraya gitmektir. 50 metreye yaklaşınca mühür açılır.",
    socialDescription:
      "Gerçek bir yere mektup bırak. Onu okumanın tek yolu oraya gitmek — 50 metreye yaklaşınca mühür açılır.",
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
    blurb: "Bir mektup bir yere aittir. Onu okumanın tek yolu oraya gitmek.",
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
    domainTagline: "laumeapp.com — Bir mektup bir yere aittir",
  },

  /** Keşif sahnesi (kök sayfa). */
  discovery: {
    metaTitle: "Laume — Bir mektup bir yere aittir",
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
    metaTitle: "Laume Nasıl Çalışır — Gerçek Bir Yere Mektup Bırak",
    metaDescription:
      "Gerçek bir yere mektup bırak: metin, fotoğraf ya da sesli fısıltı. Mektup o koordinata mühürlenir ve yalnızca 50 metreye yaklaşan kişi okuyabilir.",
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
    heroTitle: "Bir mektup bir yere aittir.",
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
      lede: "Android ve iOS cihazında konuma bağlı mektup keşfine başla.",
      playHeading: "Google Play",
      playBody: "Android 10 (API 29) ve üzeri cihazlar için.",
      appStoreHeading: "Apple App Store",
      appStoreBody: "iOS 15.0 ve üzeri iPhone cihazlar için.",
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
};

export default tr;
