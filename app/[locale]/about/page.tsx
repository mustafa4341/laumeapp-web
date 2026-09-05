import type { Metadata } from "next";
import { DEFAULT_LOCALE, buildMetadata, getDictionary, isLocale, type Locale } from "@/lib/i18n";

type Props = { params: Promise<{ locale: string }> };

async function resolve(params: Props["params"]): Promise<Locale> {
  const { locale } = await params;
  return isLocale(locale) ? locale : DEFAULT_LOCALE;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = await resolve(params);
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/about",
    title: dict.about.metaTitle,
    description: dict.about.metaDescription,
  });
}

export default async function AboutPage({ params }: Props) {
  const locale = await resolve(params);
  const t = getDictionary(locale).pages.about;

  return (
    <div>
      <div className="page-header">
        <h1>{t.heading}</h1>
        <p>{t.lede}</p>
      </div>

      <div className="card">
        <h2>{t.manifestoHeading}</h2>
        <p style={{ marginBottom: "16px" }}>{t.manifestoP1}</p>
        <p>{t.manifestoP2}</p>
      </div>

      <div className="card">
        <h2>{t.principlesHeading}</h2>
        {t.principles.map((p) => (
          <p key={p.title}>
            • <strong>{p.title}:</strong> {p.body}
          </p>
        ))}
      </div>
    </div>
  );
}
