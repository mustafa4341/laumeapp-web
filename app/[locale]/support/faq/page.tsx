import type { Metadata } from "next";
import Link from "next/link";
import {
  SITE_URL,
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
    path: "/support/faq",
    title: dict.faq.metaTitle,
    description: dict.faq.metaDescription,
  });
}

export default async function FAQPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.faq;
  const link = (p: string) => localeHref(locale, p);

  /**
   * Yapısal veri ile sayfadaki metin AYNI diziden gelir. Google, yapısal
   * veride sayfada görünmeyen bir cevap bulursa zengin sonucu tamamen düşürür;
   * bu yüzden kopyalamak değil, tek kaynaktan üretmek şart.
   */
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "@id": `${SITE_URL}${localeHref(locale, "/support/faq")}#faq`,
    inLanguage: locale,
    mainEntity: t.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div style={{ maxWidth: "760px", margin: "0 auto", padding: "var(--space-8) 0" }}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <div className="page-header" style={{ textAlign: "center", marginBottom: "var(--space-10)" }}>
        <p
          style={{
            color: "var(--color-accent)",
            fontSize: "var(--text-xs)",
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            marginBottom: "var(--space-2)",
          }}
        >
          {t.eyebrow}
        </p>
        <h1
          style={{
            fontSize: "var(--text-4xl)",
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-3)",
          }}
        >
          {t.heading}
        </h1>
        <p style={{ color: "var(--color-text-secondary)", fontSize: "var(--text-base)" }}>{t.lede}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-4)" }}>
        {t.items.map((item, i) => (
          <div className="card" key={item.q}>
            <h2
              style={{
                fontSize: "var(--text-lg)",
                color: "var(--color-text-primary)",
                marginBottom: "var(--space-2)",
              }}
            >
              {i + 1}. {item.q}
            </h2>
            <p
              style={{
                color: "var(--color-text-secondary)",
                fontSize: "var(--text-sm)",
                lineHeight: "var(--leading-relaxed)",
              }}
            >
              {item.a}
            </p>
            {i === 3 && (
              <p style={{ marginTop: "var(--space-2)", fontSize: "var(--text-sm)" }}>
                {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- statik HTML, uygulama rotası değil */}
                <a href="/delete-account" className="link-accent">
                  {t.deleteAccountLink}
                </a>
              </p>
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "var(--space-8)",
          textAlign: "center",
          display: "flex",
          gap: "var(--space-4)",
          justifyContent: "center",
          flexWrap: "wrap",
        }}
      >
        <Link href={link("/support/contact")} className="btn btn-primary">
          {t.contactCta}
        </Link>
        <Link href={link("/support")} className="btn btn-secondary">
          {t.backCta}
        </Link>
      </div>
    </div>
  );
}
