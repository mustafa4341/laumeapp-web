import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeepLinkBridge } from "@/components/deeplink/DeepLinkBridge";
import {
  DEFAULT_LOCALE,
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

  return {
    title: `${dict.letter.sealTitlePrefix} #${id}`,
    description: dict.letter.sealDescription,
    // Kanonik yüzey paylaşım sayfasıdır; köprü yalnız uygulamayı açar.
    alternates: {
      canonical: `${SITE_URL}${localeHref(locale, `/letters/${id}`)}`,
    },
    robots: {
      // Taramaya açık ama indekslenmez: engellenen bir sayfanın noindex'i
      // hiç okunmaz, o yüzden engel robots.txt'te değil burada.
      index: false,
      follow: true,
    },
  };
}

export default async function DeepLinkPage({ params }: Props) {
  const { id, locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  if (!isValidLetterId(id)) {
    notFound();
  }

  return <DeepLinkBridge letterId={id} locale={locale} />;
}
