import type { Metadata } from "next";
import { ResetPasswordBridge } from "@/components/deeplink/ResetPasswordBridge";
import {
  buildMetadata,
  getDictionary,
  resolveLocale,
  type LocaleParams,
} from "@/lib/i18n";

/**
 * `/reset-password` — Supabase şifre sıfırlama e-postasındaki bağlantının
 * indiği sayfa (kaynak: FIX-026).
 *
 * Ön eksiz `/reset-password` isteği `middleware.ts` tarafından `/tr/reset-password`
 * adresine REWRITE edilir (redirect değil) → 200 döner. App Link doğrulaması
 * yönlendirme izlemediği için bu adresin 404/redirect vermemesi şart.
 *
 * `noindex`: kişisel bir kurtarma kodu taşıyan tek kullanımlık bir yardımcı
 * sayfa; arama sonucunda yeri yok.
 */
export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const dict = getDictionary(locale);
  return {
    ...buildMetadata({
      locale,
      path: "/reset-password",
      title: dict.resetPassword.metaTitle,
      description: dict.resetPassword.metaDescription,
    }),
    robots: { index: false, follow: false },
  };
}

export default async function ResetPasswordPage({ params }: LocaleParams) {
  const locale = await resolveLocale(params);
  return <ResetPasswordBridge locale={locale} />;
}
