import type { Metadata } from "next";
import {
  buildMetadata,
  getDictionary,
  resolveLocale,
  type LocaleParams,
} from "@/lib/i18n";

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return buildMetadata({
    locale,
    path: "/press",
    title: dict.press.metaTitle,
    description: dict.press.metaDescription,
  });
}

const noteStyle = { color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)" } as const;

/** Basın kiti: gazetecilere giden e-postalar bu sayfaya bağlanır. */
export default async function PressPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).press;

  return (
    <div>
      <div className="page-header">
        <h1>{t.heading}</h1>
        <p>{t.lede}</p>
      </div>

      <div className="card">
        <h2>{t.oneLinerHeading}</h2>
        <p>{t.oneLiner}</p>
      </div>

      <div className="card">
        <h2>{t.howHeading}</h2>
        {t.how.map((step, i) => (
          <p key={step}>
            {i + 1}. {step}
          </p>
        ))}
      </div>

      <div className="card">
        <h2>{t.factsHeading}</h2>
        {t.facts.map((fact) => (
          <p key={fact.label}>
            <strong>{fact.label}:</strong> {fact.value}
          </p>
        ))}
      </div>

      <div className="card">
        <h2>{t.principlesHeading}</h2>
        {t.principles.map((p) => (
          <p key={p}>• {p}</p>
        ))}
      </div>

      <div className="card">
        <h2>{t.imagesHeading}</h2>
        <p style={noteStyle}>{t.imagesNote}</p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
            gap: "12px",
            marginTop: "12px",
          }}
        >
          {t.images.map((img) => (
            <a key={img.src} href={img.src} target="_blank" rel="noopener">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "12px" }}
              />
            </a>
          ))}
        </div>
      </div>

      <div className="card">
        <h2>{t.contactHeading}</h2>
        <p style={{ marginBottom: "12px" }}>{t.contactBody}</p>
        <a href={`mailto:${t.contactCta}`} className="btn btn-primary">
          {t.contactCta}
        </a>
      </div>
    </div>
  );
}
