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
    path: "/support/contact",
    title: dict.contact.metaTitle,
    description: dict.contact.metaDescription,
  });
}

export default async function ContactPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.pages.contact;

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", padding: "var(--space-8) 0" }}>
      <div className="page-header" style={{ textAlign: "center", marginBottom: "var(--space-8)" }}>
        <h1
          style={{
            fontSize: "var(--text-4xl)",
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-3)",
          }}
        >
          {t.heading}
        </h1>
        <p style={{ color: "var(--color-text-secondary)" }}>{t.lede}</p>
      </div>

      <div className="card" style={{ marginBottom: "var(--space-6)", padding: "var(--space-8)" }}>
        <h2
          style={{
            fontSize: "var(--text-xl)",
            color: "var(--color-text-primary)",
            marginBottom: "var(--space-4)",
          }}
        >
          {t.emailHeading}
        </h2>
        <div
          style={{
            background: "var(--color-bg-base)",
            padding: "var(--space-4)",
            borderRadius: "var(--radius-md)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            style={{
              fontSize: "var(--text-lg)",
              color: "var(--color-accent)",
              fontWeight: 600,
              textDecoration: "none",
            }}
          >
            ✉ {SUPPORT_EMAIL}
          </a>
        </div>
        <p
          style={{
            color: "var(--color-text-muted)",
            fontSize: "var(--text-xs)",
            marginTop: "var(--space-3)",
          }}
        >
          {t.responseNote}
        </p>
      </div>

      <div style={{ textAlign: "center" }}>
        <Link href={localeHref(locale, "/support")} className="btn btn-secondary">
          {dict.faq.backCta}
        </Link>
      </div>
    </div>
  );
}
