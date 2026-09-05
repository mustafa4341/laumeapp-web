import type { Metadata } from "next";
import Link from "next/link";
import {
  SUPPORT_EMAIL,
  buildMetadata,
  getDictionary,
  localeHref,
  resolveLocale,
  type LocaleParams,
} from "@/lib/i18n";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/support",
    title: dict.support.metaTitle,
    description: dict.support.metaDescription,
  });
}

export default async function SupportPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.pages.support;
  const link = (p: string) => localeHref(locale, p);

  return (
    <div>
      <div className="page-header">
        <h1>{t.heading}</h1>
        <p>{t.lede}</p>
      </div>

      <div className="card">
        <h2>{t.quickHeading}</h2>
        <div style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginTop: "16px" }}>
          <Link href={link("/support/faq")} className="btn btn-secondary">
            {dict.support.faqCta} &rarr;
          </Link>
          <Link href={link("/support/contact")} className="btn btn-secondary">
            {dict.support.contactCta} &rarr;
          </Link>
        </div>
      </div>

      <div className="card">
        <h2>{t.emailHeading}</h2>
        <p>
          {t.emailBody}{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ fontWeight: 600 }}>
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>

      <div className="card">
        <h2>{t.deleteHeading}</h2>
        <p style={{ marginBottom: "12px" }}>{t.deleteBody}</p>
        {/* Dilden bağımsız statik sayfa; Play Console'a bu adres bildirildi. */}
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- statik HTML, uygulama rotası değil */}
        <a href="/delete-account" className="btn btn-secondary">
          {t.deleteCta}
        </a>
      </div>
    </div>
  );
}
