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
  const t = getDictionary(locale).ideas;
  return buildMetadata({
    locale,
    path: "/ideas",
    title: t.metaTitle,
    description: t.metaDescription,
  });
}

export default async function IdeasPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).ideas;

  return (
    <article>
      <header className="page-header">
        <h1>{t.heading}</h1>
        <p>{t.lede}</p>
      </header>

      {t.sections.map((section) => (
        <section className="card" key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </section>
      ))}

      <section className="card">
        <h2>{t.safetyHeading}</h2>
        <p>{t.safetyBody}</p>
      </section>

      <Link href={localeHref(locale, "/home")} className="btn btn-primary">
        {t.cta}
      </Link>
    </article>
  );
}
