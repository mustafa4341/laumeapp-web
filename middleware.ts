import { NextResponse, type NextRequest } from "next/server";

/**
 * ⚠ `lib/i18n/config`'ten import YOK, hiçbir dosyadan da yok — kasıtlı.
 * 2026-09-05'te göreli yola geçmek (takma ad yerine) `MIDDLEWARE_INVOCATION_
 * FAILED` arızasını çözmedi, arıza 2026-09-14'te aynı imzayla tekrar etti;
 * yerelde (`next build` + `next start`) her ikisinde de kod sorunsuz çalıştı,
 * yalnız Vercel'in Edge çalışma zamanında çöktü. Bu, hatanın middleware'in
 * KENDİ mantığında değil, Edge izolatının modül başlatma anında başka bir
 * dosyayı paketleyip çözmesinde olduğunu düşündürüyor. Kesin kanıt yok
 * (Vercel MCP bu hesap için projeleri listeleyemiyor, runtime log'a
 * ulaşılamadı) — ama en ucuz ve geri alınabilir sonraki adım, middleware'in
 * hiçbir yerel modülü import etmemesini sağlamaktı. Dil listesi küçük ve
 * nadiren değişir; burada tek kaynaktan kopyalanması `lib/i18n/config.ts`'i
 * geçersiz kılmaz, yalnız middleware'i ondan bağımsızlaştırır.
 */
const DEFAULT_LOCALE = "tr" as const;
const LOCALES = new Set(["tr", "en"]);
function isLocale(value: string): boolean {
  return LOCALES.has(value);
}

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
const PASSTHROUGH = new Set([
  "/robots.txt",
  "/sitemap.xml",
  "/delete-account",
  /**
   * iOS App Link doğrulama dosyası. Uzantısı olmadığı için `matcher`'daki
   * `\.[\w]+$` eleyicisine takılmaz ve middleware'e ulaşır; dile sokulursa
   * `/tr/.well-known/...` olur ve 404 döner. `assetlinks.json` bu listede yok
   * çünkü `.json` uzantısı onu matcher'dan zaten çıkarıyor (kaynak: FIX-026).
   */
  "/.well-known/apple-app-site-association",
]);

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
