"use client";

import React, { useCallback, useEffect, useMemo, useReducer, useRef, useState } from "react";
import styles from "./discovery.module.css";
import {
  discoveryReducer,
  INITIAL_DISCOVERY_STATE,
  getStoredDiscoveryStatus,
  setStoredDiscoveryStatus,
} from "@/lib/discovery-machine";
import { AudioToggle } from "./AudioToggle";
import { FogField, type FogFrame } from "./FogField";
import { TraceTrail } from "./TraceTrail";
import { EnvelopeRig, type EnvelopeRigHandle } from "./EnvelopeRig";
import { useDiscoveryAudio } from "./useDiscoveryAudio";
import { useDiscoveryCompletion } from "./useDiscoveryCompletion";
import { soundEngine } from "@/lib/audio/soundEngine";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/lib/i18n/config";
import {
  TRACE_STEP_COUNT,
  buildTracePath,
  getFragmentAnchor,
  getStepCatchRadius,
  getTargetAnchor,
  type StepPoint,
} from "./traceGeometry";

const ASSET = "/assets/discovery";

/** İzin kaçıncı adımında hikâye ilerler. */
const TRACE_REVEAL_AT = 3;
const FRAGMENT_REVEAL_AT = 6;

interface Viewport {
  width: number;
  height: number;
}

function readViewport(): Viewport {
  if (typeof window === "undefined") return { width: 1440, height: 900 };
  return { width: window.innerWidth, height: window.innerHeight };
}

export function DiscoveryStage({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);
  const t = dict.discovery;

  const [state, dispatch] = useReducer(discoveryReducer, INITIAL_DISCOVERY_STATE);
  const { navigateToHome, completeDiscovery, skipDiscovery } = useDiscoveryCompletion();
  const rigHandleRef = useRef<EnvelopeRigHandle | null>(null);

  const current = state.current;
  const stateRef = useRef(current);
  stateRef.current = current;

  const [viewport, setViewport] = useState<Viewport>({ width: 1440, height: 900 });
  const [mounted, setMounted] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [coarsePointer, setCoarsePointer] = useState(false);

  const [found, setFound] = useState(0);
  const foundRef = useRef(0);
  const [idleMs, setIdleMs] = useState(0);
  const [hasMoved, setHasMoved] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useDiscoveryAudio(current);

  // ------------------------------------------------------------- ölçüm/mount
  useEffect(() => {
    setMounted(true);
    setViewport(readViewport());
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const coarse = window.matchMedia("(pointer: coarse)");
    setReducedMotion(motion.matches);
    setCoarsePointer(coarse.matches);
    const onMotion = () => setReducedMotion(motion.matches);
    const onCoarse = () => setCoarsePointer(coarse.matches);
    motion.addEventListener("change", onMotion);
    coarse.addEventListener("change", onCoarse);

    let resizeRaf = 0;
    const onResize = () => {
      cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(() => setViewport(readViewport()));
    };
    window.addEventListener("resize", onResize, { passive: true });
    return () => {
      motion.removeEventListener("change", onMotion);
      coarse.removeEventListener("change", onCoarse);
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(resizeRaf);
    };
  }, []);

  const steps: StepPoint[] = useMemo(
    () => buildTracePath(viewport.width, viewport.height),
    [viewport.width, viewport.height]
  );
  const stepsRef = useRef(steps);
  stepsRef.current = steps;

  const targetAnchor = useMemo(
    () => getTargetAnchor(viewport.width, viewport.height),
    [viewport.width, viewport.height]
  );
  const fragmentAnchor = useMemo(
    () => getFragmentAnchor(viewport.width, viewport.height),
    [viewport.width, viewport.height]
  );

  // Zarf bilinçli olarak küçük: keşfedilen bir nesne, bir afiş değil.
  const rigWidth = Math.min(
    viewport.width - 48,
    viewport.width <= 860 ? 300 : Math.max(260, viewport.width * 0.27),
    420
  );
  // Okuma aşamasında sahne mektuba odaklanır: rig büyür, zarf söner.
  const focusedRigWidth = Math.min(
    viewport.width - 40,
    viewport.width <= 860 ? 420 : Math.max(520, viewport.width * 0.5),
    720
  );

  // ---------------------------------------------------------------- yönlendirme
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("replay") === "1") {
      setStoredDiscoveryStatus(false);
      return;
    }
    if (params.get("skip") === "1" || params.get("mode") === "share") {
      dispatch({ type: "SKIP" });
      skipDiscovery("query_param");
      return;
    }
    if (getStoredDiscoveryStatus()) navigateToHome();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ------------------------------------------------------------------ önyükleme
  useEffect(() => {
    const load = (files: string[]) => {
      files.forEach((file) => {
        const img = new window.Image();
        img.src = `${ASSET}/${file}`;
        void img.decode?.().catch(() => undefined);
      });
    };
    load(["scene-background.png", "physical-trace.png", "paper-fragment-blank.png"]);
    const t = window.setTimeout(
      () =>
        load([
          "envelope-closed.png",
          "seal-intact.png",
          "seal-crack-01.png",
          "seal-crack-02.png",
          "seal-piece-left.png",
          "seal-piece-right.png",
          "envelope-open-rear.png",
          "envelope-open-front.png",
          "letter-sheet-blank.png",
        ]),
      1200
    );
    return () => window.clearTimeout(t);
  }, []);

  // ------------------------------------------------------------- kare geri çağrısı
  const lastMetersRef = useRef(18);

  const handleFrame = useCallback((frame: FogFrame) => {
    const current = stateRef.current;

    if (frame.hasMoved) {
      setHasMoved((prev) => (prev ? prev : true));
      if (current === "arrival") dispatch({ type: "START_EXPLORING" });
    }

    // Boşta kalma süresi kaba çözünürlükte yeter; kare başına render etmeyelim.
    setIdleMs((prev) => {
      const bucket = Math.floor(frame.idleMs / 500) * 500;
      return prev === bucket ? prev : bucket;
    });

    const trackingStates = ["trace", "fragment", "approaching", "near"];
    if (!trackingStates.includes(current)) return;
    // Ziyaretçi gerçekten hareket etmeden hiçbir adım "bulunmuş" sayılmaz.
    if (!frame.hasMoved) return;

    const list = stepsRef.current;
    const index = foundRef.current;
    const radius = getStepCatchRadius(window.innerWidth);

    // Kare başına yalnızca TEK adım açılabilir; sıradaki dışındaki hiçbir iz
    // yakalanamaz. Böylece yolun sırası korunur, imleç ileriye sıçrasa bile
    // aradaki izler atlanmaz.
    const advance = () => {
      const at = foundRef.current;
      if (at >= list.length) return;
      foundRef.current = at + 1;
      setFound(at + 1);
      soundEngine.playStep((at + 1) / list.length);
    };

    if (index < list.length) {
      const next = list[index];
      if (Math.hypot(frame.x - next.x, frame.y - next.y) <= radius) {
        advance();
        return;
      }
    }

    // Beklemek hikâyeyi ilerletmez. Yardım yalnızca sıradaki izi daha görünür
    // yapar; keşif eylemi her zaman ziyaretçiye ait kalır.

    // Mesafe: kalan adım sayısı + sıradaki adıma olan gerçek uzaklık.
    const idx = foundRef.current;
    if (current === "approaching") {
      const target = list[Math.min(idx, list.length - 1)];
      const dist = Math.hypot(frame.x - target.x, frame.y - target.y);
      const partial = Math.max(0, Math.min(1, 1 - dist / 460));
      const span = Math.max(1, TRACE_STEP_COUNT - FRAGMENT_REVEAL_AT);
      const progress = Math.max(0, Math.min(1, (idx - FRAGMENT_REVEAL_AT + partial) / span));
      const meters = Math.max(2, Math.min(18, Math.round(18 - 16 * progress)));
      if (meters !== lastMetersRef.current) {
        lastMetersRef.current = meters;
        dispatch({ type: "APPROACH_TARGET", meters });
      }
    }
  }, []);

  // ------------------------------------------------------------ aşama geçişleri
  useEffect(() => {
    if (current === "trace" && found >= TRACE_REVEAL_AT) {
      dispatch({ type: "FOUND_TRACE" });
    }
    if (current === "fragment" && found >= FRAGMENT_REVEAL_AT) {
      dispatch({ type: "FOUND_FRAGMENT" });
    }
    if ((current === "approaching" || current === "fragment") && found >= TRACE_STEP_COUNT) {
      dispatch({ type: "ENTER_NEAR_RANGE" });
    }
  }, [found, current]);

  // Kâğıt parçası okunacak kadar durur, sonra yol kendiliğinden devam eder.
  useEffect(() => {
    if (current !== "fragment") return;
    const t = window.setTimeout(() => dispatch({ type: "FOUND_FRAGMENT" }), 2400);
    return () => window.clearTimeout(t);
  }, [current]);

  // Yakın mesafede kısa bir duruş, sonra zarf ortaya çıkar.
  useEffect(() => {
    if (current !== "near") return;
    const t = window.setTimeout(() => dispatch({ type: "FOUND_ENVELOPE" }), 900);
    return () => window.clearTimeout(t);
  }, [current]);

  // ---------------------------------------------------------------- bitiş/atlama
  const handleFinish = useCallback(() => {
    setLeaving(true);
    dispatch({ type: "FINISH_DISCOVERY" });
    window.setTimeout(() => completeDiscovery(), 520);
  }, [completeDiscovery]);

  const handleSkip = useCallback(() => {
    setLeaving(true);
    const from = stateRef.current;
    dispatch({ type: "SKIP" });
    window.setTimeout(() => skipDiscovery(from), 320);
  }, [skipDiscovery]);

  // ------------------------------------------------------------------- klavye
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target instanceof HTMLInputElement ||
        target instanceof HTMLTextAreaElement ||
        target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === "Escape") {
        if (stateRef.current !== "completed" && stateRef.current !== "skipped") handleSkip();
        return;
      }

      if (e.key !== "Enter" && e.key !== " " && e.key !== "ArrowUp" && e.key !== "ArrowRight") {
        return;
      }
      // Mühür ve mektup kendi klavye davranışlarını yönetir; odak onlardaysa
      // buradan ikinci kez ilerletme.
      if (target?.closest?.("[data-testid='seal-press-target'], [role='button']")) return;

      e.preventDefault();

      switch (stateRef.current) {
        case "arrival":
          dispatch({ type: "START_EXPLORING" });
          break;
        case "trace":
        case "fragment":
        case "approaching":
        case "near": {
          // Klavye kullanıcısı izi tek tek ilerletir.
          const next = Math.min(TRACE_STEP_COUNT, foundRef.current + 1);
          foundRef.current = next;
          setFound(next);
          break;
        }
        case "seal-ready":
        case "seal-hold":
          rigHandleRef.current?.breakSealNow();
          break;
        case "letter-pull":
          rigHandleRef.current?.pullLetterNow();
          break;
        case "letter-read":
          dispatch({ type: "SHOW_CONTINUATION" });
          break;
        case "continuation":
          handleFinish();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handleFinish, handleSkip]);

  // Mektup okununca kısa bir nefesten sonra devam çağrısı belirir.
  useEffect(() => {
    if (current !== "letter-read") return;
    // Mektup önce ortaya oturur (900ms), sonra okunacak kadar durur.
    const t = window.setTimeout(() => dispatch({ type: "SHOW_CONTINUATION" }), 4400);
    return () => window.clearTimeout(t);
  }, [current]);

  // -------------------------------------------------------------------- görsel
  const lensActive = ["arrival", "trace", "fragment", "approaching", "near"].includes(current);

  const fogAlpha = (() => {
    switch (current) {
      case "arrival":
        return 0.88;
      case "trace":
        return 0.84;
      case "fragment":
        return 0.8;
      case "approaching": {
        const progress = Math.max(
          0,
          Math.min(1, (found - FRAGMENT_REVEAL_AT) / Math.max(1, TRACE_STEP_COUNT - FRAGMENT_REVEAL_AT))
        );
        return 0.78 - progress * 0.33;
      }
      case "near":
        return 0.34;
      case "seal-ready":
      case "seal-hold":
        return 0.1;
      default:
        return 0.03;
    }
  })();

  // Zarf, mesafe kapandıkça pustan yavaşça belirir; "Buldun." anında tamdır.
  const emergence = (() => {
    if (["arrival", "trace", "fragment"].includes(current)) return 0;
    if (current === "approaching") {
      const span = Math.max(1, TRACE_STEP_COUNT - FRAGMENT_REVEAL_AT);
      return Math.max(0, Math.min(1, (found - FRAGMENT_REVEAL_AT) / span));
    }
    return 1;
  })();

  // Yürüdüğün yol mektup okunana kadar arkanda durur; okuma anında sahne
  // yalnızca mektuba kalır.
  const trailVisible = [
    "trace",
    "fragment",
    "approaching",
    "near",
    "seal-ready",
    "seal-hold",
    "letter-pull",
  ].includes(current);
  const fragmentVisible = ["fragment", "approaching"].includes(current);

  const stuck = idleMs > 2600;

  const hint = (() => {
    if (leaving) return null;
    if (current === "arrival") {
      if (!hasMoved && mounted) {
        return coarsePointer ? t.hints.moveFinger : t.hints.moveMouse;
      }
      return null;
    }
    if (["trace", "fragment", "approaching"].includes(current) && stuck) {
      return t.hints.followTrail;
    }
    if ((current === "seal-ready" || current === "seal-hold") && idleMs > 3200) {
      return coarsePointer ? t.hints.holdSealFinger : t.hints.holdSealMouse;
    }
    return null;
  })();

  const announcement = (() => {
    switch (current) {
      case "trace":
        return t.announce.trace;
      case "fragment":
        return t.announce.fragment;
      case "near":
        return t.announce.near;
      case "seal-ready":
        return t.announce.sealReady;
      case "letter-pull":
        return t.announce.letterPull;
      case "letter-read":
        return t.announce.letterRead;
      case "continuation":
        return t.announce.continuation;
      default:
        return "";
    }
  })();

  return (
    <div
      className={styles.stage}
      data-testid="discovery-stage"
      data-state={current}
      data-reading={current === "letter-read" || current === "continuation" ? "true" : "false"}
      style={{ opacity: leaving ? 0 : 1, transition: "opacity 420ms ease-out" }}
    >
      <img className={styles.background} src={`${ASSET}/scene-background.png`} alt="" aria-hidden="true" />
      <span className={styles.vignette} aria-hidden="true" />

      <FogField fogAlpha={fogAlpha} lensActive={lensActive} onFrame={handleFrame} />

      {mounted && (
        <TraceTrail
          steps={trailVisible || current === "arrival" ? steps : []}
          found={found}
          showHint={lensActive}
          urgentHint={stuck}
        />
      )}

      {/* Yırtık kâğıt parçası — metin HTML, kâğıt görsel (asset doc §5). */}
      <div
        className={`${styles.fragment} ${fragmentVisible ? styles.fragmentVisible : ""}`}
        style={{ left: fragmentAnchor.x, top: fragmentAnchor.y }}
        aria-hidden="true"
      >
        <img
          className={styles.fragmentImage}
          src={`${ASSET}/paper-fragment-blank.png`}
          alt=""
          draggable={false}
        />
        <span className={styles.fragmentText}>{t.fragmentQuote}</span>
      </div>

      {mounted && (
        <EnvelopeRig
          ref={rigHandleRef}
          state={current}
          anchor={targetAnchor}
          width={rigWidth}
          focusedWidth={focusedRigWidth}
          emergence={emergence}
          reducedMotion={reducedMotion}
          onSealHoldStart={() => dispatch({ type: "START_SEAL_HOLD" })}
          onSealBroken={(method) => dispatch({ type: "BREAK_SEAL", method })}
          onLetterRevealed={() => dispatch({ type: "REVEAL_LETTER" })}
          labels={{ seal: t.sealAria, letter: t.letterAria, letterRegion: t.letterRegionAria }}
          letterCopy={{ title: t.letterTitle, body: t.letterBody }}
        />
      )}

      {/* --------------------------------------------------------- anlatı ---- */}
      <div className={styles.narrative}>
        {current === "arrival" && (
          <h1 key="arrival" className={styles.line} style={{ animationDelay: "820ms" }}>
            {t.arrivalTitle}
          </h1>
        )}

        {current === "trace" && (
          <>
            <p key="trace" className={styles.line}>
              {t.traceTitle}
            </p>
            <p className={styles.sub}>{t.traceSub}</p>
          </>
        )}

        {current === "fragment" && (
          <>
            <p key="fragment" className={styles.line}>
              {t.fragmentTitle}
            </p>
            <p className={styles.sub}>{t.fragmentSub}</p>
          </>
        )}

        {(current === "approaching" || current === "near") && (
          <>
            <p className={styles.distance} data-testid="distance-value">
              {state.distanceMeters}
              <span className={styles.distanceUnit}>m</span>
            </p>
            <p className={styles.sub} key={current}>
              {current === "near" ? t.nearSub : t.approachingSub}
            </p>
          </>
        )}

        {(current === "seal-ready" || current === "seal-hold") && (
          <>
            <p key="found" className={styles.line}>
              {t.foundTitle}
            </p>
            <p className={styles.sub}>
              {current === "seal-hold" ? t.holdSub : t.sealReadySub}
            </p>
          </>
        )}

        {current === "letter-pull" && (
          <p key="pull" className={styles.sub} style={{ animationDelay: "500ms" }}>
            {t.pullSub}
          </p>
        )}

        {current === "continuation" && (
          <>
            <p key="continuation" className={styles.line}>
              {t.continuationTitle}
            </p>
            <button
              type="button"
              data-testid="btn-continue-discovery"
              className={styles.continueLink}
              onClick={handleFinish}
            >
              {t.continuationCta}
            </button>
            <p className={styles.note}>{t.continuationHint}</p>
          </>
        )}
      </div>

      <div className={`${styles.hint} ${hint ? styles.hintVisible : ""}`} aria-hidden="true">
        {hint ?? ""}
      </div>

      {/* ---------------------------------------------------------- chrome ---- */}
      <div className={styles.brand}>LAUME</div>
      <div className={styles.audioSlot}>
        <AudioToggle labelOn={t.audioOn} labelOff={t.audioOff} />
      </div>
      <button
        type="button"
        data-testid="btn-skip-discovery"
        className={styles.skip}
        onClick={handleSkip}
        title={t.skipTitle}
      >
        {t.skip}
      </button>

      <p id="laume-seal-help" className="sr-only">
        {t.sealHelp}
      </p>
      <div aria-live="polite" className="sr-only">
        {announcement}
      </div>
    </div>
  );
}
