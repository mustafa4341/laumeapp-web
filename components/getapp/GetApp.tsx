"use client";

import React, { useCallback, useEffect, useState } from "react";
import styles from "./getapp.module.css";
import { appConfig } from "@/lib/config";
import { trackEvent } from "@/lib/analytics";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import {
  detectPlatform,
  normalizeSource,
  type WaitlistIntent,
  type WaitlistPlatform,
} from "@/lib/waitlist/shared";
import { WaitlistSheet } from "./WaitlistSheet";

/** Analitikte "bu tıklama nereden geldi" — kişisel veri değil, yüzey adı. */
export type GetAppSurface = "discovery_dock" | "discovery_letter" | "download_page" | "home";

interface Props {
  locale: Locale;
  surface: GetAppSurface;
  /**
   * dock  → keşif sahnesinin altındaki buzlu, küçük şerit
   * panel → sayfa içinde, daha büyük rozetler + açıklama satırı
   */
  variant?: "dock" | "panel";
  /** Panel altında durum/şehir satırını göster. */
  showNote?: boolean;
  /**
   * Rozetleri gizle ama bileşeni sökme: açık bir form diyaloğu bu bileşenin
   * içinde yaşar ve sahne durumu değişince kapanmamalı.
   */
  concealed?: boolean;
  className?: string;
}

const SOURCE_KEY = "laume_ref";

/**
 * Ziyaretçinin geldiği kanal: `?ref=karakoy-qr` veya `?utm_source=tiktok`.
 * Sekme boyunca saklanır ki keşiften /home'a, oradan /download'a geçen biri
 * formu doldurduğunda kanal kaybolmasın. Depolama yoksa yalnız URL okunur.
 */
function readSource(): string | null {
  if (typeof window === "undefined") return null;
  const params = new URLSearchParams(window.location.search);
  const fromUrl = normalizeSource(params.get("ref") ?? params.get("utm_source"));
  try {
    if (fromUrl) {
      window.sessionStorage.setItem(SOURCE_KEY, fromUrl);
      return fromUrl;
    }
    return normalizeSource(window.sessionStorage.getItem(SOURCE_KEY));
  } catch {
    return fromUrl;
  }
}

/**
 * MAĞAZA ROZETLERİ + BEKLEME LİSTESİ
 *
 * Üç durum, tek bileşen (pazarlama planındaki akış):
 *   1. Mağaza yayında          → rozet, mağazaya giden bir link
 *   2. Mağaza henüz yok        → rozet "Yakında", tıklanınca "Çıkınca haber ver"
 *   3. Yayında ama şehirde rota yok → panelde "Şehrime gelince haber ver"
 *
 * Durum tek yerden gelir: `lib/config.ts` → `appConfig.stores`. Yayına girince
 * orada `status: "active"` + `url` yazmak bu bileşeni her yerde değiştirir.
 * Olmayan bir mağaza linki asla gösterilmez (CLAUDE.md kural 2).
 */
export function GetApp({
  locale,
  surface,
  variant = "panel",
  showNote = false,
  concealed = false,
  className,
}: Props) {
  const t = getDictionary(locale).getApp;
  const { appStore, googlePlay } = appConfig.stores;
  const iosLive = appStore.status === "active" && Boolean(appStore.url);
  const androidLive = googlePlay.status === "active" && Boolean(googlePlay.url);
  const anyLive = iosLive || androidLive;

  const [sheet, setSheet] = useState<{ intent: WaitlistIntent; platform: WaitlistPlatform | null } | null>(
    null,
  );
  const [detected, setDetected] = useState<WaitlistPlatform | null>(null);
  const [source, setSource] = useState<string | null>(null);

  // Tarayıcıya özgü bilgiler yalnız mount sonrası okunur: sunucu HTML'i ile
  // istemci ilk render'ı aynı kalmalı (bkz. CLAUDE.md §E 2026-09-14).
  useEffect(() => {
    setDetected(detectPlatform(window.navigator.userAgent));
    setSource(readSource());
  }, []);

  const openSheet = useCallback(
    (intent: WaitlistIntent, platform: WaitlistPlatform | null) => {
      setSheet({ intent, platform: platform ?? detected });
      trackEvent({
        name: "web_waitlist_opened",
        payload: { platform: platform ?? detected ?? "unknown", intent, surface },
      });
    },
    [detected, surface],
  );

  const badges: Array<{
    platform: WaitlistPlatform;
    live: boolean;
    url: string | null;
    name: string;
    liveAria: string;
    soonAria: string;
    icon: React.ReactNode;
  }> = [
    {
      platform: "ios",
      live: iosLive,
      url: appStore.url,
      name: t.appStore,
      liveAria: t.appStoreLiveAria,
      soonAria: t.appStoreSoonAria,
      icon: <AppleIcon />,
    },
    {
      platform: "android",
      live: androidLive,
      url: googlePlay.url,
      name: t.googlePlay,
      liveAria: t.googlePlayLiveAria,
      soonAria: t.googlePlaySoonAria,
      icon: <PlayIcon />,
    },
  ];

  return (
    <div
      className={`${styles.root} ${variant === "dock" ? styles.dock : styles.panel} ${
        concealed ? styles.concealed : ""
      } ${className ?? ""}`}
      data-testid={`get-app-${variant}`}
    >
      <nav className={styles.badges} aria-label={t.dockAria} aria-hidden={concealed || undefined}>
        {badges.map((badge) => {
          const inner = (
            <>
              <span className={styles.badgeIcon} aria-hidden="true">
                {badge.icon}
              </span>
              <span className={styles.badgeText} aria-hidden="true">
                <span className={styles.badgeTag}>{badge.live ? t.liveTag : t.soonTag}</span>
                <span className={styles.badgeName}>{badge.name}</span>
              </span>
            </>
          );
          return badge.live && badge.url ? (
            <a
              key={badge.platform}
              href={badge.url}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.badge}
              data-status="live"
              data-testid={`store-badge-${badge.platform}`}
              aria-label={badge.liveAria}
              onClick={() =>
                trackEvent({
                  name: "web_download_cta_clicked",
                  payload: {
                    platform: badge.platform === "ios" ? "app_store" : "google_play",
                    surface,
                  },
                })
              }
            >
              {inner}
            </a>
          ) : (
            <button
              key={badge.platform}
              type="button"
              className={styles.badge}
              data-status="soon"
              data-testid={`store-badge-${badge.platform}`}
              aria-label={badge.soonAria}
              aria-haspopup="dialog"
              onClick={() => openSheet("launch", badge.platform)}
            >
              {inner}
            </button>
          );
        })}
      </nav>

      {variant === "panel" && showNote && (
        <p className={styles.note}>
          {anyLive ? (
            <button type="button" className={styles.textLink} onClick={() => openSheet("city", null)}>
              {t.cityLink}
            </button>
          ) : (
            t.soonNote
          )}
        </p>
      )}

      <WaitlistSheet
        locale={locale}
        open={sheet !== null}
        intent={sheet?.intent ?? "launch"}
        initialPlatform={sheet?.platform ?? null}
        source={source}
        onClose={() => setSheet(null)}
      />
    </div>
  );
}

function AppleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.76 1.04-1.82.93-2.88-.9.04-1.99.6-2.64 1.36-.57.66-.99 1.74-.86 2.78.99.08 2-.51 2.57-1.26z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M3.609 1.814L13.793 12 3.61 22.186a2.373 2.373 0 0 1-.61-.924V2.738c.15-.36.368-.684.609-.924zm11.255 11.257L17.72 15.93 5.373 23.06a2.023 2.023 0 0 1-1.07.25l10.561-10.239zm0-2.142L4.303.69a2.023 2.023 0 0 1 1.07.25l12.347 7.13-2.856 2.859zm1.07 1.071l3.528-2.037a1.69 1.69 0 0 1 0 2.93l-3.528 2.037-1.07-1.07 1.07-1.07z" />
    </svg>
  );
}
