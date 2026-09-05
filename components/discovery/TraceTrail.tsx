"use client";

import React from "react";
import styles from "./discovery.module.css";
import type { StepPoint } from "./traceGeometry";

interface TraceTrailProps {
  steps: StepPoint[];
  /** Kaç adım bulundu — yalnızca sıradaki adım keşfedilebilir. */
  found: number;
  /** Sıradaki adımın ipucu görünsün mü? */
  showHint: boolean;
  /** Kullanıcı takıldıysa ipucu belirginleşir (spec §4: "ziyaretçi kaybedemez"). */
  urgentHint: boolean;
}

/**
 * İz katmanı. Her ayak izi kaynak PNG'den kırpılmış tek bir sprite; ekranda
 * hedefe uzanan bir eğri boyunca dizilir. Bulunan izler kalıcı olarak görünür
 * kalır (pusun ÜSTÜNDE durur), bulunmayanlar görünmez. Yalnızca sıradaki iz
 * soluk bir nefesle nereye gidileceğini söyler.
 */
export function TraceTrail({ steps, found, showHint, urgentHint }: TraceTrailProps) {
  return (
    <div className={styles.traceLayer} aria-hidden="true">
      {steps.map((step) => {
        const sprite = step.sprite;
        const isFound = step.index < found;
        const isNext = step.index === found;
        const width = step.size;
        const height = (width * sprite.h) / sprite.w;

        const classes = [styles.step];
        if (isFound) classes.push(styles.stepFound);
        else if (isNext && showHint) {
          classes.push(styles.stepNext);
          if (urgentHint) classes.push(styles.stepNextUrgent);
        }

        return (
          <React.Fragment key={step.index}>
            <span
              className={`${styles.stepGlow} ${isFound ? styles.stepGlowOn : ""}`}
              style={{
                left: step.x - width,
                top: step.y - width,
                width: width * 2,
                height: width * 2,
              }}
            />
            <span
              data-step={step.index}
              data-found={isFound ? "true" : "false"}
              className={classes.join(" ")}
              style={{
                left: step.x - width / 2,
                top: step.y - height / 2,
                width,
                height,
                transform: `rotate(${step.angle}deg) scale(${isFound ? 1 : 0.86})`,
                // Kaynak görselden yalnızca bu ayak izini kırp.
                backgroundSize: `${100 / sprite.w}% ${100 / sprite.h}%`,
                backgroundPosition: `${(sprite.x / (1 - sprite.w)) * 100}% ${
                  (sprite.y / (1 - sprite.h)) * 100
                }%`,
              }}
            />
          </React.Fragment>
        );
      })}
    </div>
  );
}
