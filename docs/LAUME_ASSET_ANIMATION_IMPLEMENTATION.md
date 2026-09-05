# LAUME Discovery Asset + Animation Implementation

This document defines how Claude should use the production image layers in `public/assets/discovery/`. The screen reference PNGs remain in `design/laume-discovery-web/`.

## 1. Important rule: text is never baked into images

All brand, narrative, distance, instructions, letter copy and calls to action must be real HTML text. This keeps the experience responsive, localizable, selectable and accessible.

Use raster images only for physical material:

- paper grain/background;
- pressed trail marks;
- torn paper fragment;
- envelope layers;
- blank letter sheet;
- wax-seal states and broken pieces.

Fog, reveal light, progress ring, cursor response, shadows and glow must be generated in code. They need to react continuously to input and should not be flattened into PNGs.

## 2. Asset manifest

| File | Alpha | Purpose |
|---|---:|---|
| `/assets/discovery/scene-background.png` | opaque | full-screen ivory paper and contour surface |
| `/assets/discovery/physical-trace.png` | transparent | trail revealed by the pointer lens |
| `/assets/discovery/paper-fragment-blank.png` | transparent | torn story fragment; HTML text overlays it |
| `/assets/discovery/envelope-closed.png` | transparent | pre-open envelope state |
| `/assets/discovery/envelope-open-rear.png` | transparent | rear panel and open flap |
| `/assets/discovery/envelope-open-front.png` | transparent | foreground pocket placed above the letter |
| `/assets/discovery/letter-sheet-blank.png` | transparent | moving/reading sheet; HTML copy overlays it |
| `/assets/discovery/seal-intact.png` | transparent | initial seal and hold state |
| `/assets/discovery/seal-crack-01.png` | transparent | first hairline crack frame |
| `/assets/discovery/seal-crack-02.png` | transparent | full central fracture frame |
| `/assets/discovery/seal-piece-left.png` | transparent | independently animated left broken piece |
| `/assets/discovery/seal-piece-right.png` | transparent | independently animated right broken piece |

All files listed as transparent were checked for a zero-alpha corner pixel. Do not convert them to JPEG.

## 3. Discovery scene stack

```text
DiscoveryStage (position: fixed; inset: 0; overflow: hidden)
├── scene-background.png                         z: 0
├── contour/light color treatment               z: 1
├── discovered objects                          z: 4
│   ├── physical-trace.png
│   └── paper-fragment-blank.png + HTML text
├── FogField canvas/CSS mask                     z: 6
├── warm reveal response                         z: 7
├── EnvelopeRig                                  z: 10
├── narrative HTML                               z: 20
└── DiscoveryChrome                             z: 30
    ├── LAUME
    ├── sound toggle
    └── Keşfi geç
```

The fog must sit above clues but below visible UI text. The reveal lens changes fog opacity; it does not move a white spotlight graphic.

## 4. Fog and pointer reveal

Use the existing `FogWebGL.tsx` when WebGL2 is available. In light mode the shader should output pearl-white opacity instead of black fog.

Required behavior:

- Store the target pointer in refs, not React state.
- Smooth current pointer toward target each animation frame.
- Desktop reveal radius: `clamp(180px, 18vw, 260px)`.
- Touch radius: `clamp(110px, 34vw, 160px)`.
- Touch center is 20–35px above the finger.
- Pointer movement reduces fog alpha and slightly raises local contrast.
- Keep a short reveal-history buffer and let it decay over 900–1600ms.
- Suspend rendering on `document.visibilityState === "hidden"`.
- Cap canvas DPR at 1.5 on low-power devices and 2 elsewhere.

CSS fallback when WebGL2 is unavailable:

```css
.fogFallback {
  position: absolute;
  inset: -8%;
  background:
    radial-gradient(
      circle var(--reveal-radius) at var(--pointer-x) var(--pointer-y),
      rgba(255, 255, 255, 0.05) 0%,
      rgba(255, 255, 255, 0.30) 46%,
      rgba(251, 250, 247, 0.88) 76%,
      rgba(251, 250, 247, 0.97) 100%
    );
  filter: blur(18px);
  pointer-events: none;
}
```

Animate `--pointer-x` and `--pointer-y` through `requestAnimationFrame`. Do not update them through component renders on every pointer event.

## 5. Fragment composition

The torn fragment is a blank physical layer. Put the copy above it:

```tsx
<div className="fragment" aria-label="…bulacağını…">
  <img src="/assets/discovery/paper-fragment-blank.png" alt="" />
  <span aria-hidden="true">…bulacağını…</span>
</div>
```

The fragment wrapper controls rotation, scale and entry motion. Keep the text unrotated only if readability suffers; otherwise inherit the subtle paper angle.

## 6. Envelope rig

The open envelope must be layered, not played as a video or GIF.

```text
EnvelopeRig
├── envelope-open-rear.png     z: 10
├── LetterLayer               z: 20
│   ├── letter-sheet-blank.png
│   └── semantic HTML letter copy
├── envelope-open-front.png    z: 30
├── SealLayer                  z: 40
└── interaction hit target     z: 50
```

Suggested DOM:

```tsx
<div className="envelopeRig" style={{ "--pull": pullProgress } as React.CSSProperties}>
  <img className="envelopeRear" src="/assets/discovery/envelope-open-rear.png" alt="" />

  <article className="letterLayer" aria-label="Bulunan mektup">
    <img src="/assets/discovery/letter-sheet-blank.png" alt="" />
    <div className="letterCopy">
      <h2>Bu sadece ilkiydi.</h2>
      <p>Birileri, bir yerde, senin bulman için bir şey bıraktı.</p>
    </div>
  </article>

  <img className="envelopeFront" src="/assets/discovery/envelope-open-front.png" alt="" />
  <SealBreak progress={sealProgress} />
</div>
```

Core positioning:

```css
.envelopeRig {
  position: relative;
  width: min(46vw, 720px);
  aspect-ratio: 3 / 2;
  isolation: isolate;
}

.envelopeRear,
.envelopeFront {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: contain;
  pointer-events: none;
}

.envelopeRear { z-index: 10; }
.letterLayer {
  position: absolute;
  z-index: 20;
  left: 20%;
  width: 60%;
  bottom: 18%;
  transform: translateY(calc((1 - var(--pull)) * 42%));
  will-change: transform;
}
.envelopeFront { z-index: 30; }
```

Adjust the exact `left`, `width` and `bottom` values once at the 1440×900 calibration viewport, then keep all sizes proportional. Do not use independent viewport coordinates for the three envelope layers.

## 7. Closed → open envelope transition

1. Start with `envelope-closed.png` and `seal-intact.png`.
2. When the seal finishes breaking, crossfade the closed envelope out over 180–240ms.
3. At the same registered wrapper position, fade in `envelope-open-rear.png` and `envelope-open-front.png`.
4. Keep the letter initially 42% lower so the front pocket hides most of it.
5. Do not move the entire rig during the swap.

If a visible jump remains, use one 100ms ivory flash/soft paper highlight at the physical seam. Do not cover it with a large white page transition.

## 8. Hold-to-break seal animation

Use Pointer Events and pointer capture. Do not rely on click duration.

```ts
const HOLD_MS = 1050;
const RELAX_MS = 260;
```

On `pointerdown`:

- call `setPointerCapture`;
- store `performance.now()`;
- start an animation-frame loop;
- update a numeric progress value from 0 to 1;
- apply subtle seal compression: `scale(1 - progress * 0.025)`;
- draw the progress ring with SVG `stroke-dashoffset`.

On early `pointerup` or `pointercancel`:

- stop the loop;
- ease progress back toward zero over `RELAX_MS`;
- after repeated failed attempts, reduce required hold to 850ms;
- do not reset the entire experience.

Keyboard equivalent:

- Space or Enter keydown begins hold;
- keyup releases;
- reduced-motion mode completes on activation without requiring a timed hold.

### Seal timeline

| Time | Visual |
|---:|---|
| 0–70% hold | `seal-intact.png`, compression and ring only |
| 70–88% | crossfade to `seal-crack-01.png` |
| 88–100% | crossfade to `seal-crack-02.png` |
| completion + 0–120ms | hide crack frame; show both broken pieces registered together |
| 120–520ms | left piece: `translate(-14px, 8px) rotate(-5deg)`; right: `translate(14px, 10px) rotate(5deg)` |
| 360–700ms | pieces fade to 0 while open envelope appears |

Use a single wrapper size for intact/crack frames. Broken pieces sit in that same wrapper with `object-fit: contain`; apply small one-time CSS calibration variables if needed:

```css
:root {
  --seal-left-x: -1%;
  --seal-left-y: 0%;
  --seal-right-x: 0%;
  --seal-right-y: 0%;
}
```

Never animate the crack with `clip-path` alone; the supplied material frames make the wax fracture believable.

## 9. Letter pull and float animation

The letter is one blank raster sheet plus live HTML copy. During the pull stage hide the copy or keep it at zero opacity until the sheet is mostly out.

Pointer behavior:

- Pointer down on the visible top edge captures the pointer.
- `pullProgress = clamp((startY - currentY) / pullDistance, 0, 1)`.
- Recommended `pullDistance`: `min(280px, 28vh)`.
- Apply resistance above 0.88 progress.
- If released above 0.55, settle to 1; otherwise settle back to 0.
- After two failed pulls, lower completion threshold to 0.4.

Visual transform:

```css
.letterLayer {
  transform:
    translateY(calc((1 - var(--pull)) * 42%))
    rotate(calc((1 - var(--pull)) * -1.2deg))
    scale(calc(0.94 + var(--pull) * 0.06));
  filter: drop-shadow(
    0 calc(8px + var(--pull) * 10px)
    calc(14px + var(--pull) * 18px)
    rgba(15, 23, 42, calc(0.06 + var(--pull) * 0.05))
  );
}
```

At full pull:

- move the letter toward viewport center;
- increase its readable width to `min(46vw, 720px)`;
- fade the envelope to 0.35 opacity and move it down 24px;
- fade letter copy in over 400–600ms;
- keep the paper movement slow and damped, never bouncy.

Use transform-only animation during drag. Do not animate `top`, `left`, width or height per frame.

## 10. Full-screen background and object scaling

```css
.discoveryBackground {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  user-select: none;
  pointer-events: none;
}
```

Recommended object widths:

```css
.traceAsset { width: clamp(260px, 34vw, 560px); }
.fragmentAsset { width: clamp(190px, 22vw, 340px); }
.envelopeRig { width: clamp(460px, 42vw, 720px); }
.sealRig { width: clamp(92px, 9vw, 150px); }
.readingLetter { width: min(46vw, 720px); }
```

On mobile, use `min()` against `calc(100vw - 32px)` and stack the narrative copy above the object. Do not crop the envelope or letter at 360px width.

## 11. Accessible semantic copy

The visible letter copy must be inside `article`. Discovery state announcements use one `aria-live="polite"` region. Decorative images use `alt=""`. The envelope interaction has a concise accessible name such as `Mührü açmak için basılı tut`.

Do not announce every pointer or distance update. Announce only state thresholds: first trace found, near, envelope found, seal opened and letter revealed.

## 12. Reduced motion

When `prefers-reduced-motion: reduce` is active:

- disable pointer trailing and fog drift;
- reveal clues through opacity only;
- activate the seal on click/Enter without timed holding;
- replace seal-piece flight with an immediate crossfade;
- reveal the letter without drag;
- keep all story states and copy.

## 13. Preload strategy

Preload only:

- `scene-background.png`;
- `physical-trace.png`;
- `paper-fragment-blank.png`.

After the trace is found, preload envelope and seal images. After the envelope is found, preload crack frames, pieces and letter sheet. Use `HTMLImageElement.decode()` before transitioning into a state so no image visibly pops in.

## 14. Acceptance checks

- No visible copy is baked into an image.
- All material layers except the scene background have working transparency.
- Seal frames do not move more than 2px during crossfade at the calibration viewport.
- Broken seal pieces begin from the exact apparent location of the full seal.
- Letter appears behind the front pocket and above the rear layer.
- Drag stays at 60fps on a mid-range mobile device.
- Keyboard and reduced-motion paths can complete the experience.
- At 200% browser zoom the skip control and active interaction remain reachable.
- WebGL-disabled fallback preserves the full flow.

