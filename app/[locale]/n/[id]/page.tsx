import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DeepLinkBridge } from "@/components/deeplink/DeepLinkBridge";
import { isShareableNoteId, normalizeRefCode } from "@/lib/letters/noteId";
import { fetchSharePreview } from "@/lib/letters/sharePreview";
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
  /** `?ref=<kod>` — paylaşan kişinin atıf kodu; uygulamaya aynen taşınır. */
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id, locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;
  const dict = getDictionary(locale);

  if (!isShareableNoteId(id)) {
    return { title: dict.letter.invalidTitle };
  }

  /*
   * Paylaşılan adres BU rotadır (`layarUrl.ts` → `/n/<id>`), bu yüzden
   * WhatsApp/X/Signal önizlemesini üreten meta etiketleri burada olmak
   * ZORUNDA. Önizleme robotları JavaScript çalıştırmaz — istemci tarafında
   * kurulan bir başlık onlara hiç ulaşmaz, bu yüzden veri sunucuda okunur.
   *
   * Sunucu cevap veremiyorsa (henüz yapılandırılmadı, 0160 uygulanmadı, ağ
   * hatası) BAŞLIK UYDURULMAZ: genel, dürüst metne düşülür. "Bu mektup yok"
   * denmez — bilmediğimiz şeyi yokluk gibi göstermek yasak.
   */
  const preview = await fetchSharePreview(id);
  const hasRealData = preview.kind === "found";

  const title = hasRealData && preview.title ? preview.title : dict.letter.sealTitlePrefix;
  const description =
    hasRealData && preview.locationName
      ? `${preview.locationName} · ${dict.letter.sealDescription}`
      : dict.letter.sealDescription;
  const url = `${SITE_URL}${localeHref(locale, `/n/${id}`)}`;

  return {
    title,
    description,
    // Kanonik yüzey paylaşım sayfasıdır; köprü yalnız uygulamayı açar.
    alternates: {
      canonical: `${SITE_URL}${localeHref(locale, `/letters/${id}`)}`,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: dict.seo.siteName,
      locale: LOCALE_META[locale].ogLocale,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      // Taramaya açık ama indekslenmez: engellenen bir sayfanın noindex'i
      // hiç okunmaz, o yüzden engel robots.txt'te değil burada.
      // ⚠ Bu, sosyal önizlemeyi ETKİLEMEZ: WhatsApp/X kazıyıcıları robots
      // yönergesine değil, yukarıdaki og:* etiketlerine bakar.
      index: false,
      follow: true,
    },
  };
}

export default async function DeepLinkPage({ params, searchParams }: Props) {
  const { id, locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : DEFAULT_LOCALE;

  if (!isShareableNoteId(id)) {
    notFound();
  }

  /*
   * Atıf kodu paylaşım adresinde geliyor (`/n/<id>?ref=<kod>`) ve uygulamanın
   * ayrıştırıcısı onu okuyabiliyor — web arada düşürürse davetin kimden
   * geldiği ölçülemez. Doğrulanamayan bir kod TAŞINMAZ, sessizce kırpılmaz.
   */
  const refCode = normalizeRefCode((await searchParams).ref);

  return <DeepLinkBridge letterId={id} locale={locale} refCode={refCode} />;
}
