import type { Metadata } from "next";
import { HomeExperience } from "@/components/home/HomeExperience";
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
  return <HomeExperience locale={locale} />;
}
