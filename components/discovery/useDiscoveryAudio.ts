"use client";

import { useEffect, useRef } from "react";
import { soundEngine } from "@/lib/audio/soundEngine";

export function useDiscoveryAudio(currentState: string) {
  const prevStateRef = useRef<string>(currentState);
  const startedRef = useRef(false);

  useEffect(() => {
    // User gesture listener to unlock AudioContext
    const handleGesture = () => {
      if (!startedRef.current) {
        soundEngine.init();
        soundEngine.startAmbience();
        startedRef.current = true;
      }
    };

    window.addEventListener("pointerdown", handleGesture, { once: true, passive: true });
    window.addEventListener("keydown", handleGesture, { once: true, passive: true });

    return () => {
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    };
  }, []);

  useEffect(() => {
    const prev = prevStateRef.current;
    if (prev === currentState) return;
    prevStateRef.current = currentState;

    switch (currentState) {
      case "fragment":
        soundEngine.playPaperFragment();
        break;
      case "seal-ready":
        soundEngine.playReveal();
        break;
      case "letter-pull":
        soundEngine.playSealBreak();
        break;
      case "letter-read":
        soundEngine.playPaperOpen();
        break;
      case "completed":
        soundEngine.playResolution();
        soundEngine.stopAmbience();
        break;
      case "skipped":
        soundEngine.stopAmbience();
        break;
      default:
        break;
    }
  }, [currentState]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      soundEngine.stopAmbience();
    };
  }, []);
}
