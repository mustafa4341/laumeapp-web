"use client";

import React, { useState, useEffect } from "react";
import { soundEngine } from "@/lib/audio/soundEngine";

export function AudioToggle({ labelOn, labelOff }: { labelOn: string; labelOff: string }) {
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    setIsMuted(soundEngine.getMuted());
  }, []);

  const handleToggle = () => {
    const next = soundEngine.toggleMute();
    if (next) soundEngine.stopAmbience();
    else {
      soundEngine.init();
      soundEngine.startAmbience();
    }
    setIsMuted(next);
  };

  return (
    <button
      type="button"
      data-testid="btn-audio-toggle"
      onClick={handleToggle}
      aria-label={isMuted ? labelOff : labelOn}
      aria-pressed={!isMuted}
      title={isMuted ? labelOff : labelOn}
      style={{
        background: "var(--laume-surface)",
        border: "none",
        borderRadius: "var(--radius-full)",
        width: "40px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: isMuted ? "var(--color-text-tertiary)" : "var(--color-text-secondary)",
        cursor: "pointer",
        boxShadow: "var(--shadow-sm)",
        transition: "color 0.2s ease",
      }}
    >
      {isMuted ? (
        // Sound Off / Muted Icon
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="1" y1="1" x2="23" y2="23" />
          <path d="M9 9v3a3 3 0 0 0 5.12 2.12M15 9.34V4a3 3 0 0 0-5.94-.6" />
          <path d="M17 16.95A7 7 0 0 1 5 12v-2m14 0v2a7 7 0 0 1-.11 1.23" />
          <line x1="12" y1="19" x2="12" y2="23" />
          <line x1="8" y1="23" x2="16" y2="23" />
        </svg>
      ) : (
        // Sound On Icon
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
          <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
        </svg>
      )}
    </button>
  );
}
