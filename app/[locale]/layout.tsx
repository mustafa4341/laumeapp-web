import type { Metadata } from "next";
import "../globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  DEFAULT_LOCALE,
  LOCALES,
  LOCALE_META,
  SITE_URL,
  alternatesFor,
  buildJsonLd,
  getDictionary,
  isLocale,
  type Locale,
} from "@/lib/i18n";

/**
 * Bu, uygulamanın KÖK layout'udur (`app/layout.tsx` bilinçli olarak yok).
 * `<html lang>` sayfanın diline göre değişmek zorunda olduğu için layout'un
 * `[locale]` segmentinin altında olması gerekir.
 */

/** Varsayılan dil ön eksiz sunulur; ön ek yalnız diğer diller için üretilir. */
export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);
  const meta = LOCALE_META[locale];

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.discovery.metaTitle,
      template: dict.seo.titleTemplate,
    },
    description: dict.seo.description,
    keywords: dict.seo.keywords,
    applicationName: dict.seo.siteName,
    authors: [{ name: dict.seo.siteName, url: SITE_URL }],
    creator: dict.seo.siteName,
    publisher: dict.seo.siteName,
    category: "social networking",
    alternates: alternatesFor(locale, "/"),
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: meta.ogLocale,
      // Diğer diller `og:locale:alternate` olarak bildirilir.
      alternateLocale: LOCALES.filter((l) => l !== locale).map(
        (l) => LOCALE_META[l].ogLocale
      ),
      url: `${SITE_URL}${locale === DEFAULT_LOCALE ? "" : `/${locale}`}`,
      siteName: dict.seo.siteName,
      title: dict.discovery.metaTitle,
      description: dict.seo.socialDescription,
    },
    twitter: {
      card: "summary_large_image",
      title: dict.discovery.metaTitle,
      description: dict.seo.socialDescription,
    },
    other: {
      "apple-mobile-web-app-title": dict.seo.siteName,
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const jsonLd = buildJsonLd(locale);

  return (
    <html lang={LOCALE_META[locale].htmlLang}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>
        <Header locale={locale} />
        <main className="main-content">{children}</main>
        <Footer locale={locale} />
      </body>
    </html>
  );
}
