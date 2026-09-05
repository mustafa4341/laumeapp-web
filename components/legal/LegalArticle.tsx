import Link from "next/link";
import { localeHref, type Locale } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionaries";

export interface LegalSection {
  heading: string;
  body: string;
}

/**
 * Tüm yasal sayfaların ortak iskeleti.
 *
 * Her yasal sayfa aynı yapıdaydı ve JSX'i beş kez kopyalanmıştı; yeni bir dil
 * eklemek beş dosyayı da elden geçirmek demekti. Artık sayfa dosyaları yalnız
 * hangi sözlük bloğunu göstereceğini söylüyor.
 */
export function LegalArticle({
  locale,
  heading,
  lede,
  sections,
  lastUpdated,
}: {
  locale: Locale;
  heading: string;
  lede: string;
  sections: readonly LegalSection[];
  /** Yalnız gerçekten tarihlenen belgelerde gösterilir. */
  lastUpdated?: string;
}) {
  const dict = getDictionary(locale);

  return (
    <div>
      <div className="page-header">
        <h1>{heading}</h1>
        <p>{lede}</p>
        {lastUpdated && (
          <p style={{ color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)" }}>
            {dict.pages.legal.lastUpdatedLabel}: {lastUpdated}
          </p>
        )}
      </div>

      {sections.map((section) => (
        <div className="card" key={section.heading}>
          <h2>{section.heading}</h2>
          <p>{section.body}</p>
        </div>
      ))}

      <div style={{ marginTop: "24px" }}>
        <Link href={localeHref(locale, "/legal")} className="btn btn-secondary">
          {dict.pages.legal.backCta}
        </Link>
      </div>
    </div>
  );
}
