import type { Metadata } from "next";
import {
  STORES,
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
    path: "/download",
    title: dict.download.metaTitle,
    description: dict.download.metaDescription,
  });
}

export default async function DownloadPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  const t = dict.pages.download;

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
          gap: "20px",
        }}
      >
        <div className="card">
          <h2>{t.playHeading}</h2>
          <p style={{ marginBottom: "20px" }}>{t.playBody}</p>
          {/*
            Mağaza adresi tek yerde: `lib/config.ts` → `STORES`.
            Yayında değilse App Store dalıyla AYNI davranış: devre dışı buton.
            Ölü bir mağaza linki, eksik bir linkten daha kötüdür.
          */}
          {STORES.googlePlay ? (
            <a
              href={STORES.googlePlay}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              {dict.download.googlePlay} &rarr;
            </a>
          ) : (
            <button
              type="button"
              className="btn btn-secondary"
              disabled
              style={{ opacity: 0.7, cursor: "not-allowed" }}
            >
              {dict.download.googlePlay}
            </button>
          )}
        </div>

        <div className="card">
          <h2>{t.appStoreHeading}</h2>
          <p style={{ marginBottom: "20px" }}>{t.appStoreBody}</p>
          {/* App Store yayında değil: uydurma link yerine devre dışı buton. */}
          <button
            type="button"
            className="btn btn-secondary"
            disabled
            style={{ opacity: 0.7, cursor: "not-allowed" }}
          >
            {dict.download.appStore}
          </button>
        </div>
      </div>

      <p style={{ marginTop: "24px", color: "var(--color-text-tertiary)", fontSize: "var(--text-sm)" }}>
        {dict.download.requirements}
      </p>
    </div>
  );
}
