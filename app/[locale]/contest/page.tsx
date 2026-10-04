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
const noteStyle = { color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)" } as const;

/**
 * Mağaza öncesi test kanalları. App Store / Play yayına girince bu kart kaldırılır;
 * Play kapalı testine yalnız `laume-testers` grubundaki hesaplar girebilir.
 */
const TESTFLIGHT_URL = "https://testflight.apple.com/join/RvHeu3Xe";
const ANDROID_GROUP_URL = "https://groups.google.com/g/laume-testers";
const ANDROID_OPT_IN_URL = "https://play.google.com/apps/testing/app.layar.mobile";

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

      <div className="card">
        <h2>{t.tryHeading}</h2>
        <p style={{ marginBottom: "16px" }}>{t.tryLede}</p>

        <h3>{t.iosLabel}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", margin: "8px 0" }}>
          <a href={TESTFLIGHT_URL} className="btn btn-primary" rel="noopener">
            {t.iosCta}
          </a>
        </div>
        <p style={noteStyle}>{t.iosNote}</p>

        <h3 style={{ marginTop: "20px" }}>{t.androidLabel}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", margin: "8px 0" }}>
          <a href={ANDROID_GROUP_URL} className="btn btn-secondary" rel="noopener">
            {t.androidJoinCta}
          </a>
          <a href={ANDROID_OPT_IN_URL} className="btn btn-primary" rel="noopener">
            {t.androidOptInCta}
          </a>
        </div>
        <p style={noteStyle}>{t.androidNote}</p>
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
