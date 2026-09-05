import type { Metadata } from "next";
import { LegalArticle } from "@/components/legal/LegalArticle";
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
    path: "/legal/terms",
    title: dict.legal.terms.metaTitle,
    description: dict.legal.terms.metaDescription,
  });
}

export default async function Page({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).legalBodies.terms;

  return (
    <LegalArticle
      locale={locale}
      heading={t.heading}
      lede={t.lede}
      sections={t.sections}
    />
  );
}
