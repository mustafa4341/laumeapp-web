import { ImageResponse } from "next/og";
import { getDictionary, resolveLocale, type LocaleParams } from "@/lib/i18n";

export const alt = "Laume";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * Paylaşım görseli kodla üretilir: her sayfa aynı sahneyi miras alır, ayrı bir
 * PNG'yi elde güncel tutmak gerekmez.
 */
export default async function OpengraphImage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "radial-gradient(circle at 50% 45%, #FBF6EC 0%, #F4EDE1 60%, #EDE4D5 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 34,
            letterSpacing: 18,
            color: "#1F2937",
            marginBottom: 46,
          }}
        >
          LAUME
        </div>
        <div
          style={{
            fontSize: 68,
            color: "#0F172A",
            textAlign: "center",
            maxWidth: 900,
            lineHeight: 1.2,
          }}
        >
          {dict.home.heroTitle}
        </div>
        <div
          style={{
            fontSize: 30,
            color: "#5B6472",
            marginTop: 30,
            textAlign: "center",
            maxWidth: 860,
          }}
        >
          {dict.seo.tagline}
        </div>
      </div>
    ),
    size
  );
}
