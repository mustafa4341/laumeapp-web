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
    path: "/legal",
    title: dict.legal.metaTitle,
    description: dict.legal.metaDescription,
  });
}

/** Kart sırası sözlükteki `cards` dizisiyle birebir aynı olmalıdır. */
const HREFS = [
  "/legal/privacy",
  "/legal/terms",
  "/legal/community-guidelines",
  "/legal/cookies",
  "/legal/refunds",
  // Dilden bağımsız statik sayfa; Play Console'a bu adres bildirildi.
  "/delete-account",
] as const;

export default async function LegalHubPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const t = getDictionary(locale).pages.legal;

  return (
    <div>
      <div className="page-header">
        <h1>{t.heading}</h1>
        <p>{t.lede}</p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}
      >
        {t.cards.map((card, i) => {
          const href = HREFS[i];
          const isExternalStatic = href === "/delete-account";
          const content = (
            <>
              <h2>{card.title} &rarr;</h2>
              <p>{card.body}</p>
            </>
          );

          return isExternalStatic ? (
            // eslint-disable-next-line @next/next/no-html-link-for-pages -- statik HTML, uygulama rotası değil
            <a key={card.title} href={href} className="card" style={{ textDecoration: "none" }}>
              {content}
            </a>
          ) : (
            <Link
              key={card.title}
              href={localeHref(locale, href)}
              className="card"
              style={{ textDecoration: "none" }}
            >
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
