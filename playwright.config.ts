import { defineConfig, devices } from "@playwright/test";

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
    baseURL: "http://localhost:3100",
    trace: "retain-on-failure",
  },
  webServer: {
    // Use the project-local executable directly. This keeps the QA suite
    // independent from a stale or partially installed user-level npm.
    command: ".\\node_modules\\.bin\\next.cmd dev -p 3100",
    url: "http://localhost:3100",
    reuseExistingServer: true,
    timeout: 60_000,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
