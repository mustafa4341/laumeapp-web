"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import styles from "./discovery.module.css";
import { trackEvent } from "@/lib/analytics";
import { soundEngine } from "@/lib/audio/soundEngine";
import type { DiscoveryState } from "@/lib/discovery-machine";

const ASSET = "/assets/discovery";

/** Kesintisiz basılı tutma süresi (asset doc §8). */
const HOLD_MS = 1050;
/** Erken bırakınca ilerlemenin geri gevşediği süre. */
const RELAX_MS = 260;
/** Tekrarlanan başarısız denemelerden sonra inilen alt sınır. */
const MIN_HOLD_MS = 850;

const CRACK_1_AT = 0.7;
const CRACK_2_AT = 0.88;

interface EnvelopeRigProps {
  state: DiscoveryState;
  /** Zarfın ekrandaki çapası (px) — izin son adımıyla aynı nokta. */
  anchor: { x: number; y: number };
  /** Zarfın normal genişliği (px). */
  width: number;
  /** Mektup okuma aşamasındaki genişlik (px). */
  focusedWidth: number;
  /** 0 → 1: mesafe kapandıkça zarf pustan yavaşça belirir. */
  emergence: number;
  reducedMotion: boolean;
  onSealHoldStart: () => void;
  onSealBroken: (method: "hold" | "keyboard") => void;
  onLetterRevealed: () => void;
  /** Erişilebilirlik etiketleri — sayfanın dilinden gelir. */
  labels: { seal: string; letter: string; letterRegion: string };
  /** Mektubun üzerindeki gerçek metin. */
  letterCopy: { title: string; body: string };
}

export interface EnvelopeRigHandle {
  /** Klavye/azaltılmış hareket yolu: mührü anında kır. */
  breakSealNow: () => void;
  /** Klavye/azaltılmış hareket yolu: mektubu anında çek. */
  pullLetterNow: () => void;
}

/**
 * Zarf + mühür + mektup, tek ve KALICI bir rig içinde.
 *
 * Kritik nokta: bu bileşen keşif durumları arasında hiç unmount olmaz.
 * Eski uygulamada her aşama ayrı bir bileşendi; mühür kırılma ve mektup çekme
 * animasyonları hiç oynamıyordu çünkü eleman animasyon başlamadan yok oluyordu.
 * Burada tüm aşamalar aynı DOM ağacında, CSS geçişleriyle akar.
 */
export const EnvelopeRig = React.forwardRef<EnvelopeRigHandle, EnvelopeRigProps>(
  function EnvelopeRig(
    {
      state,
      anchor,
      width,
      focusedWidth,
      emergence,
      reducedMotion,
      onSealHoldStart,
      onSealBroken,
      onLetterRevealed,
      labels,
      letterCopy,
    },
    ref
  ) {
    const sealFramesRef = useRef<HTMLDivElement | null>(null);
    const crack1Ref = useRef<HTMLImageElement | null>(null);
    const crack2Ref = useRef<HTMLImageElement | null>(null);
    const ringRef = useRef<SVGCircleElement | null>(null);
    const letterRef = useRef<HTMLDivElement | null>(null);

    /** "intact" → "broken": mühür görselleri ve parçalar bu değere bağlı. */
    const [sealPhase, setSealPhase] = useState<"intact" | "breaking" | "broken">("intact");
    /** Kapalı → açık zarf çapraz geçişi, kırılmadan 200ms sonra. */
    const [envelopeOpen, setEnvelopeOpen] = useState(false);
    /** Parçaların uçuşunu tetikleyen sınıf. */
    const [piecesOut, setPiecesOut] = useState(false);
    const [holdActive, setHoldActive] = useState(false);
    const [ariaHold, setAriaHold] = useState(0);
    const [dragging, setDragging] = useState(false);
    const [settling, setSettling] = useState(false);
    const [showPullHandle, setShowPullHandle] = useState(false);

    // Zarf "yaklaşıyorsun" aşamasında da sahnededir, ama yalnızca mesafe
    // kapandıkça belirir; etkileşime ise ancak mühür hazır olunca açılır.
    const emerge = Math.max(0, Math.min(1, emergence));
    const visible = emerge > 0.98;
    const focused = state === "letter-read" || state === "continuation";
    const pullStage = state === "letter-pull";

    // ---------------------------------------------------------------- mühür
    const holdRef = useRef(0);
    const holdRafRef = useRef<number | null>(null);
    const holdStartRef = useRef<number | null>(null);
    const relaxFromRef = useRef(0);
    const relaxStartRef = useRef<number | null>(null);
    const releaseCountRef = useRef(0);
    const requiredHoldRef = useRef(HOLD_MS);
    const sealDoneRef = useRef(false);

    const paintSeal = useCallback((progress: number) => {
      const frames = sealFramesRef.current;
      if (frames) frames.style.setProperty("--hold", String(progress));
      if (crack1Ref.current) {
        crack1Ref.current.style.opacity = String(
          Math.min(1, Math.max(0, (progress - CRACK_1_AT) / (CRACK_2_AT - CRACK_1_AT)))
        );
      }
      if (crack2Ref.current) {
        crack2Ref.current.style.opacity = String(
          Math.min(1, Math.max(0, (progress - CRACK_2_AT) / (1 - CRACK_2_AT)))
        );
      }
      const ring = ringRef.current;
      if (ring) {
        const circumference = Number(ring.dataset.circumference ?? 0);
        ring.style.strokeDashoffset = String(circumference * (1 - progress));
        ring.style.opacity = progress > 0.01 ? "1" : "0";
      }
    }, []);

    const stopHoldLoop = useCallback(() => {
      if (holdRafRef.current !== null) cancelAnimationFrame(holdRafRef.current);
      holdRafRef.current = null;
    }, []);

    const breakSeal = useCallback(
      (method: "hold" | "keyboard") => {
        if (sealDoneRef.current) return;
        sealDoneRef.current = true;
        stopHoldLoop();
        holdRef.current = 1;
        paintSeal(1);
        setHoldActive(false);
        setAriaHold(100);
        setSealPhase("breaking");
        onSealBroken(method);
      },
      [onSealBroken, paintSeal, stopHoldLoop]
    );

    const holdTick = useCallback(
      (now: number) => {
        if (sealDoneRef.current) return;
        if (holdStartRef.current !== null) {
          const elapsed = now - holdStartRef.current;
          const next = Math.min(1, elapsed / requiredHoldRef.current);
          holdRef.current = next;
          paintSeal(next);
          setAriaHold(Math.round(next * 100));
          // Mum gerildikçe sürtünme sesi de gerilir — basılı tutmanın ağırlığı.
          soundEngine.playWaxFriction(next);
          if (next >= 1) {
            breakSeal("hold");
            return;
          }
        } else if (relaxStartRef.current !== null) {
          const elapsed = now - relaxStartRef.current;
          const t = Math.min(1, elapsed / RELAX_MS);
          const next = relaxFromRef.current * (1 - t);
          holdRef.current = next;
          paintSeal(next);
          setAriaHold(Math.round(next * 100));
          if (t >= 1) {
            relaxStartRef.current = null;
            stopHoldLoop();
            return;
          }
        } else {
          stopHoldLoop();
          return;
        }
        holdRafRef.current = requestAnimationFrame(holdTick);
      },
      [breakSeal, paintSeal, stopHoldLoop]
    );

    const beginHold = useCallback(() => {
      if (sealDoneRef.current) return;
      if (state !== "seal-ready" && state !== "seal-hold") return;
      onSealHoldStart();
      if (reducedMotion) {
        breakSeal("keyboard");
        return;
      }
      setHoldActive(true);
      relaxStartRef.current = null;
      // Kalan ilerlemeden devam et — erken bırakma sıfırlamaz.
      holdStartRef.current =
        performance.now() - holdRef.current * requiredHoldRef.current;
      stopHoldLoop();
      holdRafRef.current = requestAnimationFrame(holdTick);
    }, [breakSeal, holdTick, onSealHoldStart, reducedMotion, state, stopHoldLoop]);

    const releaseHold = useCallback(() => {
      if (sealDoneRef.current || holdStartRef.current === null) return;
      holdStartRef.current = null;
      setHoldActive(false);
      releaseCountRef.current += 1;
      if (releaseCountRef.current >= 2) {
        requiredHoldRef.current = Math.max(MIN_HOLD_MS, requiredHoldRef.current - 100);
      }
      relaxFromRef.current = holdRef.current;
      relaxStartRef.current = performance.now();
      stopHoldLoop();
      holdRafRef.current = requestAnimationFrame(holdTick);
    }, [holdTick, stopHoldLoop]);

    // Kırılma zaman çizelgesi (asset doc §8).
    useEffect(() => {
      if (sealPhase !== "breaking") return;
      // Parçalar önce başlangıç konumunda boyanmalı ki CSS geçişi gerçekten
      // oynasın. rAF sekme arka plandayken durabildiği için zamanlayıcı
      // kullanılır — animasyon her koşulda tetiklenir.
      const piecesTimer = window.setTimeout(() => setPiecesOut(true), 40);
      const openTimer = window.setTimeout(() => setEnvelopeOpen(true), reducedMotion ? 0 : 200);
      const doneTimer = window.setTimeout(
        () => setSealPhase("broken"),
        reducedMotion ? 60 : 760
      );
      return () => {
        window.clearTimeout(piecesTimer);
        window.clearTimeout(openTimer);
        window.clearTimeout(doneTimer);
      };
    }, [sealPhase, reducedMotion]);

    // ---------------------------------------------------------------- mektup
    const pullRef = useRef(0);
    const dragStartYRef = useRef<number | null>(null);
    const dragStartPullRef = useRef(0);
    const pullDoneRef = useRef(false);
    const failedPullsRef = useRef(0);
    const pullThresholdRef = useRef(0.5);

    const paintPull = useCallback((value: number) => {
      pullRef.current = value;
      letterRef.current?.style.setProperty("--pull", String(value));
    }, []);

    const pullDistance = useCallback(
      () => Math.min(280, Math.max(140, window.innerHeight * 0.28)),
      []
    );

    const completePull = useCallback(() => {
      if (pullDoneRef.current) return;
      pullDoneRef.current = true;
      setDragging(false);
      setSettling(true);
      setShowPullHandle(false);
      paintPull(1);
      trackEvent({ name: "web_letter_pulled" });
      // Kâğıt önce oturur, sonra okuma aşamasına geçilir — sıçrama olmaz.
      window.setTimeout(() => onLetterRevealed(), reducedMotion ? 60 : 420);
    }, [onLetterRevealed, paintPull, reducedMotion]);

    const settleTo = useCallback(
      (target: number) => {
        if (reducedMotion) {
          paintPull(target);
          return;
        }
        setSettling(true);
        paintPull(target);
        // CSS geçişi bitince "settling" sınıfını kaldır ki sürükleme
        // yeniden anlık hissettirsin.
        window.setTimeout(() => setSettling(false), 480);
      },
      [paintPull, reducedMotion]
    );

    const handleLetterPointerDown = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        if (!pullStage || pullDoneRef.current) return;
        e.preventDefault();
        if (reducedMotion) {
          completePull();
          return;
        }
        try {
          e.currentTarget.setPointerCapture(e.pointerId);
        } catch {
          // Yakalama desteklenmiyorsa window dinleyicileri yine de çalışır.
        }
        dragStartYRef.current = e.clientY;
        dragStartPullRef.current = pullRef.current;
        setSettling(false);
        setDragging(true);
      },
      [completePull, pullStage, reducedMotion]
    );

    // Sürükleme window üzerinde dinlenir: imleç mektubun dışına çıksa da
    // jest kopmaz (eski uygulamanın "mektubu açamıyorum" hatasının kaynağı).
    useEffect(() => {
      if (!dragging) return;

      const onMove = (e: PointerEvent) => {
        if (dragStartYRef.current === null || pullDoneRef.current) return;
        const raw =
          dragStartPullRef.current + (dragStartYRef.current - e.clientY) / pullDistance();
        // 0.88 üstünde direnç: kâğıdın ağırlığı hissedilsin.
        const shaped =
          raw <= 0.88 ? raw : 0.88 + (raw - 0.88) / (1 + (raw - 0.88) * 4);
        const clamped = Math.min(1, Math.max(0, shaped));
        // Kâğıt zarfın içinde kaydıkça hışırdar; hız arttıkça ses de artar.
        soundEngine.playPaperSlide(Math.abs(clamped - pullRef.current) * 12);
        paintPull(clamped);
        if (clamped >= 0.995) completePull();
      };

      const onUp = () => {
        if (pullDoneRef.current) return;
        dragStartYRef.current = null;
        setDragging(false);
        if (pullRef.current >= pullThresholdRef.current) {
          settleTo(1);
          window.setTimeout(() => completePull(), reducedMotion ? 0 : 260);
          return;
        }
        failedPullsRef.current += 1;
        // İki başarısız denemeden sonra eşik düşer — ziyaretçi kaybedemez.
        if (failedPullsRef.current >= 2) pullThresholdRef.current = 0.35;
        settleTo(0);
      };

      window.addEventListener("pointermove", onMove, { passive: true });
      window.addEventListener("pointerup", onUp);
      window.addEventListener("pointercancel", onUp);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };
    }, [completePull, dragging, paintPull, pullDistance, reducedMotion, settleTo]);

    // Çekme aşamasında tutamak ipucu: hemen değil, biraz bekledikten sonra.
    useEffect(() => {
      if (!pullStage) {
        setShowPullHandle(false);
        return;
      }
      const t = window.setTimeout(() => setShowPullHandle(true), 360);
      return () => window.clearTimeout(t);
    }, [pullStage]);

    // Okuma aşamasına geçince mektup tam açık olsun (klavye yolu dâhil).
    useEffect(() => {
      if (focused) {
        pullDoneRef.current = true;
        paintPull(1);
      }
    }, [focused, paintPull]);

    useEffect(() => {
      return () => {
        if (holdRafRef.current !== null) cancelAnimationFrame(holdRafRef.current);
      };
    }, []);

    React.useImperativeHandle(
      ref,
      () => ({
        breakSealNow: () => breakSeal("keyboard"),
        pullLetterNow: () => {
          if (pullDoneRef.current) return;
          settleTo(1);
          window.setTimeout(() => completePull(), reducedMotion ? 0 : 240);
        },
      }),
      [breakSeal, completePull, reducedMotion, settleTo]
    );

    // ---------------------------------------------------------------- render
    const ringRadius = 46;
    const circumference = 2 * Math.PI * ringRadius;

    const sealInteractive = state === "seal-ready" || state === "seal-hold";
    const rigWidth = focused ? focusedWidth : width;

    return (
      <div
        className={`${styles.rig} ${visible ? styles.rigVisible : ""}`}
        style={
          {
            left: focused ? "50%" : `${anchor.x}px`,
            top: focused ? "50%" : `${anchor.y}px`,
            width: `${rigWidth}px`,
            "--emerge": emerge,
          } as React.CSSProperties
        }
        data-testid="envelope-rig"
      >
        <span
          className={`${styles.rigLight} ${emerge > 0.2 && !focused ? styles.rigLightOn : ""}`}
          aria-hidden="true"
        />

        {/* Kapalı zarf — mühür kırılana kadar. */}
        <img
          src={`${ASSET}/envelope-closed.png`}
          alt=""
          aria-hidden="true"
          className={`${styles.envelopeLayer} ${styles.envelopeClosed} ${
            sealPhase === "breaking" ? styles.envelopeBreaking : ""
          }`}
          style={{ opacity: envelopeOpen ? 0 : 1 }}
        />

        {/* Açık zarf: arka katman → mektup → ön cep (asset doc §6). */}
        <img
          src={`${ASSET}/envelope-open-rear.png`}
          alt=""
          aria-hidden="true"
          className={`${styles.envelopeLayer} ${styles.envelopeRear} ${
            focused ? styles.envelopeDimmed : ""
          }`}
          style={{ opacity: envelopeOpen ? (focused ? 0.22 : 1) : 0 }}
        />

        <div
          ref={letterRef}
          className={`${styles.letterLayer} ${dragging ? styles.letterDragging : ""} ${
            settling ? styles.letterSettling : ""
          } ${focused ? styles.letterFocused : ""}`}
          data-testid="letter-sheet"
          style={{
            opacity: envelopeOpen ? 1 : 0,
            cursor: pullStage ? undefined : "default",
          }}
          role={pullStage ? "button" : undefined}
          tabIndex={pullStage ? 0 : -1}
          aria-label={pullStage ? labels.letter : undefined}
          onPointerDown={handleLetterPointerDown}
          onKeyDown={(e) => {
            if (!pullStage) return;
            if (e.key === "ArrowUp" || e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              settleTo(1);
              window.setTimeout(() => completePull(), reducedMotion ? 0 : 240);
            }
          }}
        >
          <img
            src={`${ASSET}/letter-sheet-blank.png`}
            alt=""
            aria-hidden="true"
            className={styles.letterImage}
            draggable={false}
          />

          <article
            className={`${styles.letterCopy} ${focused ? styles.letterCopyVisible : ""}`}
            aria-label={labels.letterRegion}
            aria-hidden={!focused}
          >
            <h2 className={styles.letterTitle}>{letterCopy.title}</h2>
            <span className={styles.letterRule} aria-hidden="true" />
            <p className={styles.letterBody}>
              {letterCopy.body}
            </p>
          </article>

          <span
            className={`${styles.pullHandle} ${
              showPullHandle && pullStage ? styles.pullHandleVisible : ""
            }`}
            aria-hidden="true"
          >
            <svg width="22" height="14" viewBox="0 0 22 14" fill="none">
              <path
                d="M2 12L11 3l9 9"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>

        <img
          src={`${ASSET}/envelope-open-front.png`}
          alt=""
          aria-hidden="true"
          className={`${styles.envelopeLayer} ${styles.envelopeFront} ${
            focused ? styles.envelopeDimmed : ""
          }`}
          style={{ opacity: envelopeOpen ? (focused ? 0.22 : 1) : 0 }}
        />

        {/* Mühür katmanı — kırılana kadar kapalı zarfın kapak ucunda. */}
        {sealPhase !== "broken" && (
          <button
            type="button"
            data-testid="seal-press-target"
            className={styles.sealRig}
            style={{ opacity: envelopeOpen ? 0 : 1 }}
            disabled={!sealInteractive}
            aria-label={labels.seal}
            aria-describedby="laume-seal-help"
            role="slider"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={ariaHold}
            aria-valuetext={`Mühür ilerlemesi ${ariaHold} yüzde`}
            onPointerDown={(e) => {
              e.preventDefault();
              try {
                e.currentTarget.setPointerCapture(e.pointerId);
              } catch {
                // yok sayılabilir
              }
              beginHold();
            }}
            onPointerUp={releaseHold}
            onPointerCancel={releaseHold}
            onLostPointerCapture={releaseHold}
            onKeyDown={(e) => {
              if (e.key !== " " && e.key !== "Enter") return;
              e.preventDefault();
              if (e.repeat) return;
              beginHold();
            }}
            onKeyUp={(e) => {
              if (e.key !== " " && e.key !== "Enter") return;
              releaseHold();
            }}
          >
            <span className={styles.sealHit} aria-hidden="true" />

            <svg className={styles.sealRing} viewBox="0 0 100 100" aria-hidden="true">
              <circle className={styles.sealRingTrack} cx="50" cy="50" r={ringRadius} />
              <circle
                ref={ringRef}
                className={styles.sealRingProgress}
                cx="50"
                cy="50"
                r={ringRadius}
                data-circumference={circumference}
                style={{
                  strokeDasharray: circumference,
                  strokeDashoffset: circumference,
                  opacity: 0,
                }}
              />
            </svg>

            <div
              ref={sealFramesRef}
              className={`${styles.sealFrames} ${
                sealInteractive && !holdActive && sealPhase === "intact" ? styles.sealIdle : ""
              }`}
            >
              {sealPhase === "intact" ? (
                <>
                  <img src={`${ASSET}/seal-intact.png`} alt="" className={styles.sealFrame} />
                  <img
                    ref={crack1Ref}
                    src={`${ASSET}/seal-crack-01.png`}
                    alt=""
                    className={styles.sealFrame}
                    style={{ opacity: 0 }}
                  />
                  <img
                    ref={crack2Ref}
                    src={`${ASSET}/seal-crack-02.png`}
                    alt=""
                    className={styles.sealFrame}
                    style={{ opacity: 0 }}
                  />
                </>
              ) : (
                <>
                  <img
                    src={`${ASSET}/seal-piece-left.png`}
                    alt=""
                    className={`${styles.sealPiece} ${piecesOut ? styles.sealPieceLeftOut : ""}`}
                  />
                  <img
                    src={`${ASSET}/seal-piece-right.png`}
                    alt=""
                    className={`${styles.sealPiece} ${piecesOut ? styles.sealPieceRightOut : ""}`}
                  />
                </>
              )}
            </div>
          </button>
        )}
      </div>
    );
  }
);
