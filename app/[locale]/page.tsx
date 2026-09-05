import type { Metadata } from "next";
import { DiscoveryStage } from "@/components/discovery/DiscoveryStage";
import { DEFAULT_LOCALE, buildMetadata, getDictionary, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  return buildMetadata({
    locale,
    path: "/",
    // Sahnedeki başlık bilinçli olarak gizemli ("Burada bir şey var."), fakat
    // arama sonucunda görünen başlık ürünü anlatmak zorunda: kimse "burada bir
    // şey var" diye aramaz.
    title: dict.discovery.metaTitle,
    description: dict.seo.description,
    absoluteTitle: true,
  });
}

export default async function RootPage({ params }: Props) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  return <DiscoveryStage locale={locale} />;
}
