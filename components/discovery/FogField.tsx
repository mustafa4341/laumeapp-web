"use client";

import React, { useEffect, useRef } from "react";
import styles from "./discovery.module.css";

export interface FogFrame {
  /** Yumuşatılmış imleç konumu (px, viewport). */
  x: number;
  y: number;
  /** İmlecin anlamlı biçimde hareket etmediği süre (ms). */
  idleMs: number;
  /** Kullanıcı bu oturumda hiç imleç/parmak oynattı mı? */
  hasMoved: boolean;
}

interface FogFieldProps {
  /** Hedef pus yoğunluğu (0 = tamamen açık, 1 = kapalı). */
  fogAlpha: number;
  /** Keşif merceği aktif mi? Kapalıyken sadece pus yoğunluğu animasyonu döner. */
  lensActive: boolean;
  /** Her karede çağrılır. React state'i güncellemek için değil, ölçüm için. */
  onFrame?: (frame: FogFrame) => void;
}

/**
 * Pus + keşif merceği.
 *
 * Canvas 2D kullanır (WebGL2 gerektirmez, her yerde çalışır — spec §10).
 * Tüm imleç durumu ref'lerde tutulur; kare başına React render'ı yoktur.
 * Pusun altında zemin, üstünde iz/zarf/metin katmanları vardır: mercek bir
 * "el feneri grafiği" çizmez, yalnızca pusu inceltir.
 */
export function FogField({ fogAlpha, lensActive, onFrame }: FogFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onFrameRef = useRef(onFrame);
  onFrameRef.current = onFrame;
  const fogAlphaRef = useRef(fogAlpha);
  fogAlphaRef.current = fogAlpha;
  const lensActiveRef = useRef(lensActive);
  lensActiveRef.current = lensActive;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let reducedMotion = motionQuery.matches;
    const handleMotionChange = () => {
      reducedMotion = motionQuery.matches;
    };
    motionQuery.addEventListener("change", handleMotionChange);

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      // Pus düşük frekanslı bir yüzey; tam DPR'de çizmek boşuna maliyet.
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    // İmleç: hedef (target) ve yumuşatılmış (current) konum.
    const pointer = {
      tx: width * 0.5,
      ty: height * 0.72,
      cx: width * 0.5,
      cy: height * 0.72,
      hasMoved: false,
      lastMoveAt: performance.now(),
      lastX: -9999,
      lastY: -9999,
      touch: false,
    };

    const setPointer = (clientX: number, clientY: number, touch: boolean) => {
      // Dokunmatikte mercek parmağın ~28px üstünde durur, aksi hâlde
      // keşfedilen yeri parmak kapatır (asset doc §4).
      const y = touch ? clientY - 28 : clientY;
      pointer.tx = clientX;
      pointer.ty = y;
      pointer.touch = touch;
      if (!pointer.hasMoved) {
        pointer.hasMoved = true;
        pointer.cx = clientX;
        pointer.cy = y;
      }
      if (Math.hypot(clientX - pointer.lastX, y - pointer.lastY) > 6) {
        pointer.lastMoveAt = performance.now();
        pointer.lastX = clientX;
        pointer.lastY = y;
      }
    };

    const handlePointerMove = (e: PointerEvent) =>
      setPointer(e.clientX, e.clientY, e.pointerType === "touch");
    const handlePointerDown = (e: PointerEvent) =>
      setPointer(e.clientX, e.clientY, e.pointerType === "touch");
    const handleTouchMove = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setPointer(t.clientX, t.clientY, true);
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerdown", handlePointerDown, { passive: true });
    window.addEventListener("touchmove", handleTouchMove, { passive: true });

    // Geçmiş konumlar: bırakılan yer hemen kapanmaz, 1.4 sn boyunca solar.
    const trail: { x: number; y: number; t: number }[] = [];
    const TRAIL_MS = 1400;

    let currentFog = fogAlphaRef.current;
    let rafId: number | null = null;
    let running = true;

    const draw = () => {
      if (!(width > 0) || !(height > 0)) return;

      const now = performance.now();
      const lerp = reducedMotion ? 1 : 0.14;
      pointer.cx += (pointer.tx - pointer.cx) * lerp;
      pointer.cy += (pointer.ty - pointer.cy) * lerp;

      // Pus yoğunluğu durumlar arasında sıçramaz, kayarak değişir.
      currentFog += (fogAlphaRef.current - currentFog) * (reducedMotion ? 1 : 0.06);
      if (Math.abs(currentFog - fogAlphaRef.current) < 0.002) currentFog = fogAlphaRef.current;

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);

      if (currentFog > 0.004) {
        ctx.globalCompositeOperation = "source-over";
        // İnci beyazı pus — koyu değil, ışıklı (asset doc §4).
        const veil = ctx.createLinearGradient(0, 0, 0, height);
        veil.addColorStop(0, `rgba(255, 255, 255, ${currentFog})`);
        veil.addColorStop(1, `rgba(251, 250, 247, ${currentFog})`);
        ctx.fillStyle = veil;
        ctx.fillRect(0, 0, width, height);

        if (lensActiveRef.current && pointer.hasMoved) {
          const radius =
            width <= 860
              ? Math.max(110, Math.min(160, width * 0.34))
              : Math.max(180, Math.min(260, width * 0.18));

          const last = trail[trail.length - 1];
          if (!last || now - last.t > 70) {
            trail.push({ x: pointer.cx, y: pointer.cy, t: now });
          }
          while (trail.length && now - trail[0].t > TRAIL_MS) trail.shift();

          ctx.globalCompositeOperation = "destination-out";
          for (const point of trail) {
            const fade = Math.max(0, 1 - (now - point.t) / TRAIL_MS);
            if (fade <= 0.01) continue;
            const g = ctx.createRadialGradient(point.x, point.y, 0, point.x, point.y, radius);
            g.addColorStop(0, `rgba(0, 0, 0, ${0.94 * fade})`);
            g.addColorStop(0.55, `rgba(0, 0, 0, ${0.6 * fade})`);
            g.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = g;
            ctx.fillRect(point.x - radius, point.y - radius, radius * 2, radius * 2);
          }

          // Tek ve kusursuz daire "el feneri" gibi görünüyordu. Üç örtüşen,
          // yavaşça kayan lobe sisin organik biçimde aralanmasını sağlar.
          const driftX = Math.sin(now / 1900) * radius * 0.055;
          const driftY = Math.cos(now / 2300) * radius * 0.045;
          const cutLobe = (x: number, y: number, r: number, strength: number) => {
            const core = ctx.createRadialGradient(x, y, 0, x, y, r);
            core.addColorStop(0, `rgba(0, 0, 0, ${strength})`);
            core.addColorStop(0.52, `rgba(0, 0, 0, ${strength * 0.66})`);
            core.addColorStop(1, "rgba(0, 0, 0, 0)");
            ctx.fillStyle = core;
            ctx.fillRect(x - r, y - r, r * 2, r * 2);
          };

          cutLobe(pointer.cx + driftX, pointer.cy + driftY, radius, 0.96);
          cutLobe(
            pointer.cx - radius * 0.2 - driftX * 0.5,
            pointer.cy + radius * 0.08,
            radius * 0.72,
            0.58
          );
          cutLobe(
            pointer.cx + radius * 0.2,
            pointer.cy - radius * 0.12 - driftY * 0.5,
            radius * 0.68,
            0.52
          );

          ctx.globalCompositeOperation = "source-over";
        } else {
          trail.length = 0;
        }
        ctx.globalCompositeOperation = "source-over";
      } else {
        trail.length = 0;
      }

      onFrameRef.current?.({
        x: pointer.cx,
        y: pointer.cy,
        idleMs: now - pointer.lastMoveAt,
        hasMoved: pointer.hasMoved,
      });
    };

    const loop = () => {
      if (!running) return;
      draw();
      rafId = requestAnimationFrame(loop);
    };

    // Sekme görünmezken render durur (spec §7).
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        running = false;
        if (rafId !== null) cancelAnimationFrame(rafId);
        rafId = null;
      } else if (!running) {
        running = true;
        pointer.lastMoveAt = performance.now();
        rafId = requestAnimationFrame(loop);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);

    rafId = requestAnimationFrame(loop);

    return () => {
      running = false;
      if (rafId !== null) cancelAnimationFrame(rafId);
      motionQuery.removeEventListener("change", handleMotionChange);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, []);

  return <canvas ref={canvasRef} className={styles.fogCanvas} aria-hidden="true" />;
}
