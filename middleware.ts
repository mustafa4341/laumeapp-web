import { NextResponse, type NextRequest } from "next/server";
// ⚠ `@/` takma adı DEĞİL, göreli yol. Middleware Edge çalışma zamanında ayrı
// paketlenir; takma ad çözümlemesini o yoldan tamamen çıkarmak, 2026-09-05'te
// yaşanan `MIDDLEWARE_INVOCATION_FAILED` arızasının olası sebeplerinden birini
// eler. Tek kaynak yine aynı dosya — yalnız ona ulaşma biçimi sadeleşti.
import { DEFAULT_LOCALE, isLocale } from "./lib/i18n/config";

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

/**
 * ⚠ NEDEN HER ŞEY TRY/CATCH İÇİNDE
 *
 * 2026-09-05: Next.js uygulaması ilk kez Vercel'e çıktığında SİTENİN TAMAMI
 * `500 MIDDLEWARE_INVOCATION_FAILED` verdi — ana sayfa, yasal sayfalar,
 * paylaşım linkleri, hepsi. Yerelde (`next build` + `next start`) aynı kod
 * sorunsuz çalışıyordu; hata yalnız Vercel'in Edge çalışma zamanında çıktı.
 *
 * Buradaki ders mimari: **dil yönlendirmesi bir KOLAYLIKTIR, sitenin ayakta
 * kalma şartı değildir.** Bu fonksiyon çökerse ziyaretçi Türkçe yerine
 * yönlendirilmemiş bir sayfa görmeli — hiçbir şey görmemeli DEĞİL. Gizlilik
 * politikası ve hesap silme adresleri Play Console'a bildirildi; oradaki bir
 * robot 500 görürse yayın reddedilir (`PLAY-CONSOLE-YAYIN-DOSYASI.md` §0.1).
 *
 * Yakalanan hata sessizce yutulmaz: `x-laume-mw-error` başlığıyla görünür
 * kalır (kural 2 — sessiz fallback yasak). Başlık yalnız kendi hata
 * metnimizi taşır, istek/kullanıcı verisi taşımaz.
 */
export function middleware(request: NextRequest) {
  try {
    return route(request);
  } catch (error) {
    const response = NextResponse.next();
    response.headers.set(
      "x-laume-mw-error",
      (error instanceof Error ? `${error.name}: ${error.message}` : String(error)).slice(0, 200),
    );
    return response;
  }
}

function route(request: NextRequest) {
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
