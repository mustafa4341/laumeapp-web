"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { setStoredDiscoveryStatus } from "@/lib/discovery-machine";
import { localeHref, type Locale } from "@/lib/i18n/config";

export function useDiscoveryCompletion(locale: Locale) {
  const router = useRouter();

  // Elle yazılan "/home" İngilizce keşiften çıkan ziyaretçiyi Türkçeye
  // düşürüyordu (CLAUDE.md kural 4).
  const navigateToHome = useCallback(() => {
    router.push(localeHref(locale, "/home"));
  }, [locale, router]);

  // Analitik olayları reducer'da bir kez gönderilir (lib/discovery-machine.ts);
  // burada yalnızca kalıcılık + yönlendirme yapılır, yoksa çift sayılır.
  const completeDiscovery = useCallback(() => {
    setStoredDiscoveryStatus(true);
    navigateToHome();
  }, [navigateToHome]);

  const skipDiscovery = useCallback(
    (_fromState: string) => {
      setStoredDiscoveryStatus(true);
      navigateToHome();
    },
    [navigateToHome]
  );

  return {
    navigateToHome,
    completeDiscovery,
    skipDiscovery,
  };
}
