import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeepLinkBridge } from "@/components/deeplink/DeepLinkBridge";
import { isShareableNoteId } from "@/lib/letters/noteId";
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

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  if (!isShareableNoteId(id)) {
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

  if (!isShareableNoteId(id)) {
    notFound();
  }

  return <DeepLinkBridge letterId={id} locale={locale} />;
}
