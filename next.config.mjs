import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,

  /**
   * Play Console'a bildirilen yasal URL'ler (layar deposu
   * `docs/PLAY-CONSOLE-YAYIN-DOSYASI.md` §0.1 ve §1):
   *
   *   https://laumeapp.com/privacy      → middleware (dil farkındalığı gerekir)
   *   https://laumeapp.com/terms        → middleware
   *   https://laumeapp.com/delete-account → aşağıdaki rewrite (statik HTML)
   *
   * Üçü de 404 dönüyordu. `/privacy` ve `/terms` dile göre farklı sayfaya
   * gitmek zorunda olduğu için `middleware.ts` içinde çözülür; yalnızca
   * dilden bağımsız statik hesap silme sayfası burada kalır.
   */
  async rewrites() {
    return [
      { source: '/delete-account', destination: '/delete-account.html' },
      { source: '/delete-account.html', destination: '/delete-account.html' },
      { source: '/icon-generator.html', destination: '/icon-generator.html' }
    ];
  },

  /**
   * Eski statik HTML kopyaları kanonik uygulama rotalarına kalıcı olarak
   * taşınır: aynı içeriğin iki indekslenebilir adresi olmasın.
   * `/delete-account.html` ve `/icon-generator.html` hariç — birincisinin
   * uygulama rotası yok, ikincisi zaten indekslenmiyor.
   */
  async redirects() {
    return [
      { source: '/privacy.html', destination: '/legal/privacy', permanent: true },
      { source: '/support.html', destination: '/support', permanent: true }
    ];
  }
};

export default nextConfig;
