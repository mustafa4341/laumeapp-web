import type { Metadata } from "next";
import Link from "next/link";
import {
  buildMetadata,
  getDictionary,
  resolveLocale,
  type LocaleParams,
} from "@/lib/i18n";
import { localeHref } from "@/lib/i18n/config";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/contest",
    title: dict.contest.metaTitle,
    description: dict.contest.metaDescription,
  });
}

/** Madde işaretli metinler sözlükte `\n` ile ayrılır; satır sonları korunur. */
const multiline = { whiteSpace: "pre-line" } as const;

export default async function ContestPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).contest;

  return (
    <div>
      <div className="page-header">
        <h1>{t.heading}</h1>
        <p>{t.lede}</p>
        <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)" }}>
          {t.datesNote}
        </p>
      </div>

      <h2>{t.prizesHeading}</h2>
      {t.prizes.map((prize) => (
        <div className="card" key={prize.heading}>
          <h2>{prize.heading}</h2>
          <p style={multiline}>{prize.body}</p>
        </div>
      ))}

      {t.sections.map((section) => (
        <div className="card" key={section.heading}>
          <h2>{section.heading}</h2>
          <p style={multiline}>{section.body}</p>
        </div>
      ))}

      <div className="card">
        <h2>{t.linksHeading}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px" }}>
          <Link href={localeHref(locale, "/download")} className="btn btn-primary">
            {t.downloadCta}
          </Link>
          <Link href={localeHref(locale, "/home")} className="btn btn-secondary">
            {t.aboutCta}
          </Link>
          <a href="mailto:contest@laumeapp.com" className="btn btn-secondary">
            {t.emailCta}
          </a>
        </div>
      </div>
    </div>
  );
}
