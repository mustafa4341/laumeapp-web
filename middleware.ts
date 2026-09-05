import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, isLocale } from "@/lib/i18n/config";

/**
 * DİL YÖNLENDİRMESİ + YASAL URL TAKMA ADLARI
 *
 * Rota ağacı `app/[locale]/...` altında yaşar, ama varsayılan dil (Türkçe)
 * URL'de ön ek TAŞIMAZ: `/support` çalışır, `/tr/support` değil. Bu middleware
 * ön eksiz istekleri içeriden `/tr/...` adresine **rewrite** eder; tarayıcıdaki
 * URL değişmez.
 *
 * Neden yönlendirme (redirect) değil rewrite:
 *   `laumeapp.com/privacy` ve `/delete-account` adresleri Play Console'a bu
 *   hâlleriyle bildirildi ve yayın dosyası "404/redirect/login duvarı =
 *   otomatik red" diye uyarıyor. Rewrite 200 döner, robot içeriği görür.
 *   Arama motorunda tekilliği sayfanın kendi `canonical` etiketi sağlar.
 */

/** Dilden bağımsız kısa yollar → gerçek rota. Her dilde geçerlidir. */
const PATH_ALIASES: Record<string, string> = {
  "/privacy": "/legal/privacy",
  "/terms": "/legal/terms",
};

/**
 * Dile bağlı OLMAYAN uç noktalar. `/delete-account` özellikle burada:
 * içeriği `public/delete-account.html` statik dosyasıdır ve `next.config.mjs`
 * içindeki rewrite ile çözülür. Middleware onu dile sokarsa o rewrite'a hiç
 * ulaşılamaz (sıra: redirects → middleware → rewrites).
 */
const PASSTHROUGH = new Set(["/robots.txt", "/sitemap.xml", "/delete-account"]);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PASSTHROUGH.has(pathname)) return NextResponse.next();

  const segments = pathname.split("/").filter(Boolean);
  const first = segments[0];

  // Zaten ön ekli bir dil: yalnız takma adı çöz, dokunma.
  if (first && isLocale(first)) {
    const rest = `/${segments.slice(1).join("/")}`;
    const alias = PATH_ALIASES[rest === "/" ? "" : rest.replace(/\/$/, "")];
    if (alias) {
      const url = request.nextUrl.clone();
      url.pathname = `/${first}${alias}`;
      return NextResponse.rewrite(url);
    }
    // `/tr/...` kanonik değil: varsayılan dil ön eksiz sunulur. Kalıcı olarak
    // ön eksiz adrese taşı ki iki adres aynı içeriği sunmasın.
    if (first === DEFAULT_LOCALE) {
      const url = request.nextUrl.clone();
      url.pathname = rest === "/" ? "/" : rest;
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  // Ön eksiz istek → varsayılan dile rewrite.
  const normalized = pathname === "/" ? "/" : pathname.replace(/\/$/, "");
  const target = PATH_ALIASES[normalized] ?? normalized;
  const url = request.nextUrl.clone();
  url.pathname = `/${DEFAULT_LOCALE}${target === "/" ? "" : target}`;
  return NextResponse.rewrite(url);
}

export const config = {
  /**
   * Next iç kaynakları, statik varlıklar ve dosya uzantılı her şey dışarıda.
   * `opengraph-image` ve `icon` gibi üretilen görseller de rota olduğu için
   * middleware'den geçer; onlar `[locale]` altında zaten çözülür.
   */
  matcher: ["/((?!_next/|assets/|api/|.*\\.[\\w]+$).*)"],
};
