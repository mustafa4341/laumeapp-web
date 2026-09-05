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
    googlePlay: {
      url: "https://play.google.com/store/apps/details?id=app.layar.mobile",
      status: "active",
      label: "Google Play",
    },
    appStore: {
      url: null,
      status: "coming_soon",
      label: "App Store (Çok Yakında)",
    },
  },
};
