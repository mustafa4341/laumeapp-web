"use client";

import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { setStoredDiscoveryStatus } from "@/lib/discovery-machine";

export function useDiscoveryCompletion() {
  const router = useRouter();

  const navigateToHome = useCallback(() => {
    router.push("/home");
  }, [router]);

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
