import type { Metadata } from "next";
import { Hero } from "@/components/home/Hero";
import { ProductIntro } from "@/components/home/ProductIntro";
import { HowItWorks } from "@/components/home/HowItWorks";
import { DownloadCTA } from "@/components/home/DownloadCTA";
import {
  buildMetadata,
  getDictionary,
  resolveLocale,
  type LocaleParams,
} from "@/lib/i18n";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/home",
    // Kök sayfayla AYNI başlığı taşımamalı: iki sayfa aynı sorguda yarışır.
    title: dict.home.metaTitle,
    description: dict.home.metaDescription,
  });
}

export default async function HomePage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);

  return (
    <div className="container">
      <Hero locale={locale} />
      <ProductIntro locale={locale} />
      <HowItWorks locale={locale} />
      <DownloadCTA locale={locale} />
    </div>
  );
}
