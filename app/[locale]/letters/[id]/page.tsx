import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PublicLetterPreview } from "@/components/letter/PublicLetterPreview";
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  SITE_URL,
  getDictionary,
  isLocale,
  localeHref,
  type Locale,
} from "@/lib/i18n";

type Props = {
  params: Promise<{ id: string; locale: string }>;
};

function isValidLetterId(id: string): boolean {
  return /^[a-zA-Z0-9_-]{3,32}$/.test(id);
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  if (!isValidLetterId(id)) {
    return { title: dict.letter.invalidTitle };
  }

  const path = `/letters/${id}`;
  const url = `${SITE_URL}${localeHref(locale, path)}`;
  const title = `${dict.letter.metaTitlePrefix} #${id}`;

  return {
    title,
    description: dict.letter.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title,
      description: dict.letter.metaDescription,
      url,
      siteName: dict.seo.siteName,
      locale: LOCALE_META[locale].ogLocale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: dict.letter.metaDescription,
    },
  };
}

export default async function ShareableLetterPage({ params }: Props) {
  const { id, locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  if (!isValidLetterId(id)) {
    notFound();
  }

  return <PublicLetterPreview letterId={id} locale={locale} />;
}
