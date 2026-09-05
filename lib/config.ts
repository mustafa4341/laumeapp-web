export interface StoreLinkConfig {
  url: string | null;
  status: "active" | "coming_soon" | "disabled";
  label: string;
}

export interface AppConfig {
  appName: string;
  tagline: string;
  domain: string;
  supportEmail: string;
  stores: {
    googlePlay: StoreLinkConfig;
    appStore: StoreLinkConfig;
  };
}

export const appConfig: AppConfig = {
  appName: "Laume",
  tagline: "Bir mektup bir yere aittir",
  domain: "laumeapp.com",
  supportEmail: "destek@laumeapp.com",
  stores: {
    /**
     * ⚠ YAYINA GİRİNCE TEK SATIRLIK GERİ DÖNÜŞ:
     *   status: "active"  +  url: PLAY_LISTING_URL
     *
     * Şu an `coming_soon`, çünkü uygulama Play'de HENÜZ YAYINDA DEĞİL:
     * adres 2026-09-05'te doğrulandı ve **HTTP 404** döndü (karşılaştırma
     * için bilinen canlı bir uygulama aynı anda 200 döndü — yani engelleme
     * değil, gerçekten yok). Yayın durumu: `layar` deposu →
     * `docs/LAUME-YAYIN-CHECKLIST.md` (kapalı test bile başlamadı).
     *
     * `active` bırakılsaydı ana sayfadaki birincil indirme düğmesi her
     * ziyaretçiyi 404'e götürürdü. `StoreButtons` bu durumda düğmeyi
     * devre dışı gösterir — kayıp bir tıklama, kırık bir vaatten iyidir.
     */
    googlePlay: {
      url: null,
      status: "coming_soon",
      label: "Google Play",
    },
    appStore: {
      url: null,
      status: "coming_soon",
      label: "App Store (Çok Yakında)",
    },
  },
};
