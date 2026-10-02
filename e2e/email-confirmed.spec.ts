import { test, expect } from "@playwright/test";

/**
 * Kayıt doğrulama bağlantısının indiği sayfa (layar `AUTH_CONFIRM_REDIRECT_URL`).
 * Hata varken "doğrulandı" demez; arama motoruna kapalıdır.
 */
test.describe("E-posta doğrulama sayfası", () => {
  test("başarılı dönüşte doğrulandı der ve indekslenmez", async ({ page }) => {
    const response = await page.goto("/auth/confirmed?code=abc");
    expect(response?.status()).toBe(200);
    await expect(page.getByTestId("email-confirmed")).toHaveAttribute("data-state", "ok");
    await expect(page.getByRole("heading", { name: "E-posta adresin doğrulandı." })).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
  });

  test("süresi dolmuş bağlantıda doğrulandı demez", async ({ page }) => {
    await page.goto("/auth/confirmed#error=access_denied&error_code=otp_expired");
    await expect(page.getByTestId("email-confirmed")).toHaveAttribute("data-state", "error");
    await expect(page.getByRole("heading", { name: "Bu bağlantı artık geçerli değil." })).toBeVisible();
  });

  test("İngilizce sürüm çalışır", async ({ page }) => {
    await page.goto("/en/auth/confirmed");
    await expect(page.getByRole("heading", { name: "Your email is verified." })).toBeVisible();
  });
});
