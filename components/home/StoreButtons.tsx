"use client";

import React from "react";
import { appConfig } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";

interface Props {
  size?: "md" | "lg";
}

export function StoreButtons({ size = "md" }: Props) {
  const { googlePlay, appStore } = appConfig.stores;
  const btnClass = size === "lg" ? "btn btn-lg" : "btn";

  const handleGooglePlayClick = () => {
    trackEvent({ name: "web_download_cta_clicked", payload: { platform: "google_play" } });
  };

  return (
    <div style={{ display: "flex", gap: "var(--space-3)", flexWrap: "wrap", alignItems: "center" }}>
      {/* Google Play */}
      {googlePlay.status === "active" && googlePlay.url ? (
        <a
          href={googlePlay.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleGooglePlayClick}
          className={`${btnClass} btn-primary`}
          style={{ gap: "var(--space-3)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M3.609 1.814L13.793 12 3.61 22.186a2.373 2.373 0 0 1-.61-.924V2.738c.15-.36.368-.684.609-.924zm11.255 11.257L17.72 15.93 5.373 23.06a2.023 2.023 0 0 1-1.07.25l10.561-10.239zm0-2.142L4.303.69a2.023 2.023 0 0 1 1.07.25l12.347 7.13-2.856 2.859zm1.07 1.071l3.528-2.037a1.69 1.69 0 0 1 0 2.93l-3.528 2.037-1.07-1.07 1.07-1.07z" />
          </svg>
          <span>{googlePlay.label}</span>
        </a>
      ) : (
        <button
          type="button"
          disabled
          className={`${btnClass} btn-secondary`}
          style={{ opacity: 0.6, cursor: "not-allowed" }}
          aria-disabled="true"
        >
          <span>{googlePlay.label}</span>
        </button>
      )}

      {/* Apple App Store */}
      {appStore.status === "active" && appStore.url ? (
        <a
          href={appStore.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`${btnClass} btn-secondary`}
          style={{ gap: "var(--space-3)" }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.76 1.04-1.82.93-2.88-.9.04-1.99.6-2.64 1.36-.57.66-.99 1.74-.86 2.78.99.08 2-.51 2.57-1.26z" />
          </svg>
          <span>{appStore.label}</span>
        </a>
      ) : (
        <button
          type="button"
          disabled
          className={`${btnClass} btn-secondary`}
          style={{ opacity: 0.6, cursor: "not-allowed", gap: "var(--space-2)" }}
          aria-disabled="true"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.76 1.04-1.82.93-2.88-.9.04-1.99.6-2.64 1.36-.57.66-.99 1.74-.86 2.78.99.08 2-.51 2.57-1.26z" />
          </svg>
          <span>{appStore.label}</span>
        </button>
      )}
    </div>
  );
}
