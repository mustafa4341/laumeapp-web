import type { Metadata } from "next";
import {
  buildMetadata,
  getDictionary,
  resolveLocale,
  type LocaleParams,
} from "@/lib/i18n";
import { GetApp } from "@/components/getapp/GetApp";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/download",
    title: dict.download.metaTitle,
    description: dict.download.metaDescription,
  });
}

export default async function DownloadPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.pages.download;

  /*
    Videoların, QR'ların ve topluluk davetlerinin gideceği tek adres burası:
    tek başlık, tek cümle, iki rozet. Mağaza durumu tek yerden gelir
    (`lib/config.ts` → `appConfig.stores`); yayında olmayan rozet "çıkınca
    haber ver" formunu açar, ölü mağaza linki hiç gösterilmez.
  */
  return (
    <div className="download-hero">
      <div className="page-header">
        <h1>{t.heading}</h1>
        <p>{t.lede}</p>
      </div>

      <GetApp locale={locale} surface="download_page" variant="panel" showNote />

      <p className="download-requirements">{dict.download.requirements}</p>
    </div>
  );
}
