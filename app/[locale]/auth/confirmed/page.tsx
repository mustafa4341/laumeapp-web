import type { Metadata } from "next";
import { EmailConfirmedBridge } from "@/components/deeplink/EmailConfirmedBridge";
import {
  buildMetadata,
  getDictionary,
  resolveLocale,
  type LocaleParams,
} from "@/lib/i18n";

/**
 * `/auth/confirmed` — kayıt doğrulama e-postasındaki bağlantının indiği sayfa.
 *
 * Uygulama `signUp` / `resend` çağrılarında `emailRedirectTo` olarak
 * `https://www.laumeapp.com/auth/confirmed` verir (layar `authTransport.ts` →
 * `AUTH_CONFIRM_REDIRECT_URL`). Supabase e-postayı yönlendirmeden ÖNCE
 * doğrular; bu sayfanın işi ziyaretçiyi boş ekranda bırakmamaktır.
 *
 * `noindex`: tek kullanımlık yardımcı sayfa.
 */
export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return {
    ...buildMetadata({
      locale,
      path: "/auth/confirmed",
      title: dict.emailConfirmed.metaTitle,
      description: dict.emailConfirmed.metaDescription,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function EmailConfirmedPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  return <EmailConfirmedBridge locale={locale} />;
}
