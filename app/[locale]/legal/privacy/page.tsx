import type { Metadata } from "next";
import Link from "next/link";
import {
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
    path: "/legal/privacy",
    title: dict.legal.privacy.metaTitle,
    description: dict.legal.privacy.metaDescription,
  });
}

export default async function PrivacyPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const page = dict.pages.legal;
  const t = page.privacyBody;

  return (
    <div>
      <div className="page-header">
        <h1>{dict.legal.privacy.metaTitle}</h1>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)" }}>
          {page.lastUpdatedLabel}: {page.lastUpdated}
        </p>
      </div>

      <div className="card">
        <h2>{t.collectHeading}</h2>
        <ul style={{ paddingLeft: "20px", color: "var(--muted)", lineHeight: 1.8 }}>
          {t.collectItems.map((item) => (
            <li key={item.title}>
              <strong>{item.title}:</strong> {item.body}
            </li>
          ))}
        </ul>
      </div>

      <div className="card">
        <h2>{t.useHeading}</h2>
        <p>{t.useBody}</p>
      </div>

      <div style={{ marginTop: "24px" }}>
        <Link href={localeHref(locale, "/legal")} className="btn btn-secondary">
          {page.backCta}
        </Link>
      </div>
    </div>
  );
}
