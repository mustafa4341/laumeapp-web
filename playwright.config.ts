import { defineConfig, devices } from "@playwright/test";

/**
 * Üç çalışma biçimi:
 *   varsayılan      → `next dev` (hızlı geliştirme)
 *   E2E_PROD=1      → `next start` (önce `next build`). Statik ön-render
 *                     yalnız burada olur; sunucu/istemci hydration farkları
 *                     (ör. çift header/footer) dev modunda GÖRÜNMEZ.
 *   E2E_BASE_URL=…  → çalışan bir siteye (ör. https://laumeapp.com) karşı,
 *                     sunucu başlatmadan.
 */
const externalBaseURL = process.env.E2E_BASE_URL;
const prod = process.env.E2E_PROD === "1";

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  // A single shared Next dev server backs every worker; parallel workers
  // cause compile contention and flaky navigation timing, not real failures.
  workers: 1,
  // The dev server can occasionally recompile mid-test, delaying a timer-
  // gated assertion; one retry absorbs that without masking real failures.
  retries: 1,
  reporter: [["list"]],
  use: {
    baseURL: externalBaseURL ?? "http://localhost:3100",
    trace: "retain-on-failure",
  },
  webServer: externalBaseURL
    ? undefined
    : {
        // Use the project-local executable directly. This keeps the QA suite
        // independent from a stale or partially installed user-level npm.
        command: `.\\node_modules\\.bin\\next.cmd ${prod ? "start" : "dev"} -p 3100`,
        url: "http://localhost:3100",
        // Prod koşusunda eski bir dev sunucusunu yeniden kullanmak testi
        // anlamsız kılar: statik ön-render farkları dev'de oluşmaz.
        reuseExistingServer: !prod,
        timeout: 60_000,
      },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
