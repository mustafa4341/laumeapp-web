# LAUME Web Discovery — Claude Implementation Specification

## 1. Goal

Rebuild the first-visit discovery experience and `/home` visual system from the approved desktop references in `design/laume-discovery-web/`.

Use the production transparent image layers and exact animation construction described in `docs/LAUME_ASSET_ANIMATION_IMPLEMENTATION.md`. Do not bake text into those images or use the full-screen reference PNGs as page backgrounds.

The experience must communicate the product through interaction before explanation:

`uncertainty → curiosity → discovery → proximity → tactile payoff → emotional reward → continuation`

This is a light-theme experience. Do not restore the old black/dark Layar presentation. The product name is **LAUME** everywhere visible to the user.

## 2. Approved screen sequence

| Step | Reference | State | Required visible copy |
|---:|---|---|---|
| 1 | `01-arrival.png` | arrival | `Burada bir şey var.` |
| 2 | `02-first-trace.png` | first trace | `Bir iz.` |
| 3 | `03-paper-fragment.png` | paper fragment | `…bulacağını…` |
| 4 | `04-proximity.png` | approaching | `18 m`, `yaklaşıyorsun` |
| 5 | `05-near.png` | near | `2 m`, `yakın.` |
| 6 | `06-found-envelope.png` | seal ready | `Buldun.`, `Şimdi aç.` |
| 7 | `07-hold-seal.png` | seal hold | `Basılı tut.` |
| 8 | `08-pull-letter.png` | letter pull | `Yukarı çek.` |
| 9 | `09-letter-content.png` | letter read | `Bu sadece ilkiydi.` |
| 10 | `10-continuation-cta.png` | continuation | `Yakınında başka ne var?`, `Bulmaya devam et →` |
| 11 | `11-home.png` | `/home` | `Bazı şeyler bulunmak için bırakılır.` |

The PNGs are visual acceptance references, not images to place as full-page backgrounds. Build the interface using semantic HTML, CSS, SVG/canvas/WebGL and reusable components. Raster assets may be extracted or recreated only for physical paper/wax texture where code-native rendering is insufficient.

## 3. Non-negotiable design tokens

Update both `app/globals.css` and `lib/tokens.ts`; they currently disagree. CSS and TypeScript must expose the same values.

### Color

```css
--laume-bg: #fbfaf7;
--laume-surface: #ffffff;
--laume-paper: #fffefb;
--laume-paper-edge: #ede9e1;
--laume-ink: #0f172a;
--laume-muted: #64748b;
--laume-violet: #7c3aed;
--laume-violet-pressed: #6d28d9;
--laume-violet-soft: #ede9fe;
--laume-amber: #d7a65a;
--laume-amber-high: #f0ce8d;
--laume-fog: rgba(255, 255, 255, 0.78);
--laume-fog-deep: rgba(251, 250, 247, 0.96);
--laume-border: rgba(15, 23, 42, 0.10);
```

Rules:

- Violet means brand, primary action, active interaction or wax. Do not spread it across decorative elements.
- Amber means a meaningful discovery or proximity response only.
- Paper is reserved for letter/envelope surfaces.
- Shadows are neutral, never violet.
- No dark sections, neon colors, colorful gradients or glassmorphism-heavy cards.

### Typography

Use a locally loaded or privacy-safe editorial serif for discovery statements and letter content. Use the existing UI sans stack for navigation and controls.

```css
--font-ui: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
--font-editorial: "Cormorant Garamond", Georgia, serif;

--type-brand: 20px/1 600;
--type-discovery: clamp(38px, 3.2vw, 52px)/1.12 500;
--type-distance: clamp(56px, 6vw, 82px)/1 400;
--type-letter-title: clamp(42px, 4vw, 64px)/1.1 500;
--type-home-hero: clamp(56px, 5.4vw, 82px)/1.08 500;
--type-body: 17px/1.6 400;
--type-label: 15px/1.3 600;
--type-caption: 13px/1.35 500;
```

Do not use oversized startup typography during discovery. Only `/home` may use the larger hero scale.

### Layout

- Desktop outer margin: `clamp(32px, 4vw, 72px)`.
- Discovery stage fills `100dvh` and does not scroll.
- Story text sits left of center; the physical discovery target sits right of center.
- Never center every state like a marketing hero.
- Hit targets are at least `44 × 44px`.
- Content card radius maximum is `16px`; navigation/action pill may be larger.

## 4. State machine changes

Replace the coarse eight-state model in `lib/discovery-machine.ts` with these explicit states:

```ts
type DiscoveryState =
  | "arrival"
  | "trace"
  | "fragment"
  | "approaching"
  | "near"
  | "seal-ready"
  | "seal-hold"
  | "letter-pull"
  | "letter-read"
  | "continuation"
  | "completed"
  | "skipped";
```

Required actions:

```ts
START_EXPLORING
FOUND_TRACE
FOUND_FRAGMENT
APPROACH_TARGET
ENTER_NEAR_RANGE
FOUND_ENVELOPE
START_SEAL_HOLD
UPDATE_SEAL_HOLD
BREAK_SEAL
UPDATE_LETTER_PULL
REVEAL_LETTER
SHOW_CONTINUATION
FINISH_DISCOVERY
SKIP
RESTART
```

Rules:

- All transitions must be deterministic and testable.
- Pointer movement can update reveal position without putting every pixel update in React state; use refs and animation frames.
- Distance decreases calmly and imperfectly toward the hidden target. It may rise slightly when moving away but must not reset heavily.
- The visitor cannot lose. After 2.5–3.5 seconds without useful movement, subtly widen the reveal toward the target or warm the correct edge.
- Preserve the old completion storage key for migration reads, but write a new `laume_discovery_completed` key. A returning visitor should normally go to `/home`.
- `/support`, `/legal`, `/download`, `/letters/[id]` and `/n/[id]` must never be blocked by discovery.

## 5. Component plan

Keep `components/discovery/DiscoveryStage.tsx` as the orchestration boundary. It should own the reducer, input mode, skip action and routing, not the visual internals of every state.

Create or refactor toward:

```text
components/discovery/
  DiscoveryStage.tsx
  DiscoveryChrome.tsx
  DiscoveryWorld.tsx
  FogField.tsx
  RevealLens.tsx
  PhysicalTrace.tsx
  PaperFragment.tsx
  ProximityReadout.tsx
  Envelope.tsx
  WaxSeal.tsx
  SealHoldControl.tsx
  LetterPullControl.tsx
  LetterSheet.tsx
  states/
    ArrivalState.tsx
    TraceState.tsx
    FragmentState.tsx
    ApproachingState.tsx
    NearState.tsx
    SealReadyState.tsx
    SealHoldState.tsx
    LetterPullState.tsx
    LetterReadState.tsx
    ContinuationState.tsx
```

`DiscoveryChrome` owns only:

- `LAUME` top-left
- sound toggle top-right
- `Keşfi geç` bottom-left

Do not show website navigation inside discovery.

Remove the existing button-driven instructions such as `Aramaya Başla`, `İzi Takip Et`, `Daha Yaklaş`, `Mührü Bul` and long tutorial paragraphs. Interaction itself teaches the user. Keyboard and screen-reader alternatives remain available through accessible labels and visually hidden instructions.

## 6. Per-screen implementation details

### 01 — Arrival

- Initial pause: 700–1000ms before the statement fades in.
- Fog is already present; do not visibly load it afterward.
- A nearly invisible amber point may exist at the target.
- First pointer/touch movement transitions to `trace`.

### 02 — First trace

- Desktop reveal radius: 180–260px; scale with viewport.
- Reveal follows pointer with a soft lag, never a visible flashlight ring.
- Previously revealed area refogs over 900–1600ms.
- When the lens intersects the controlled trace region, show `Bir iz.` for 800–1200ms and advance.

### 03 — Paper fragment

- Reveal a small torn paper object, not a card or modal.
- Render only `…bulacağını…`.
- After approximately one second, expose the next subtle trace.

### 04–05 — Proximity

- Begin around `18 m`; end at `2 m`.
- Use tabular numerals but no slot-machine animation.
- No map pin, compass, coordinates or fake live-location implication.
- Fog motion and background noise reduce as distance closes.

### 06 — Found envelope

- Use an ivory envelope with a deep-violet wax seal.
- Copy: `Buldun.` and `Şimdi aç.`
- Warm light is localized and physically plausible.

### 07 — Hold seal

- Pointer down / Space / Enter begins hold.
- Required continuous hold: 900–1200ms.
- Show a single thin ring around the seal; progress is not presented as a percentage.
- Early release smoothly relaxes progress; after repeated releases, reduce the required hold slightly.
- Break into two restrained pieces. No explosion, sparks, confetti or reward sound.

### 08 — Pull letter

- Drag upward on the letter edge. Keyboard alternative: Up Arrow, Enter or Space.
- Pull progress should have resistance and settle, but must always complete.
- Show `Yukarı çek.` only as a small instruction.

### 09 — Letter

- Letter sheet becomes the primary reading surface.
- Exact copy:

  `Bu sadece ilkiydi.`

  `Birileri, bir yerde, senin bulman için bir şey bıraktı.`

- Reading text uses editorial serif with comfortable line length and spacing.

### 10 — Continuation

- Question: `Yakınında başka ne var?`
- Primary link: `Bulmaya devam et →`
- Note: `Uygulamayı açar.`
- CTA moves to `/home` for the web flow unless a verified mobile deep-link is available.

### 11 — Home

- Implement the two-column hero shown in `11-home.png`.
- Normal navigation returns here: `Nasıl çalışır`, `Hakkında`, `Destek`, `Uygulamayı indir`.
- Replace every visible `Layar` with `Laume` or `LAUME` according to context.
- Hero headline: `Bazı şeyler bulunmak için bırakılır.`
- Body: `Laume, bir yere bırakılan mektupları yalnızca oraya gerçekten giden insanların keşfedebildiği sessiz bir deneyimdir.`
- Primary action: `Keşfetmeye başla`.
- Secondary action: `Keşfi yeniden yaşa →` linking to `/?replay=1`.
- The mobile-app preview must use a real existing Laume/Layar app screenshot as source material; do not fabricate stats, reviews or user activity.

## 7. Motion contract

Use motion to communicate material and state, never as decoration.

| Motion | Duration | Easing |
|---|---:|---|
| press feedback | 80–120ms | ease-out |
| opacity/color | 160–240ms | standard |
| story copy fade | 400–600ms | ease-out |
| reveal-lens follow | frame-driven | damped lerp |
| fog return | 900–1600ms | ease-in-out |
| seal hold | 900–1200ms | linear progress + physical compression |
| seal break | 420–700ms | emphasized |
| letter pull settle | 320–520ms | damped spring |
| discovery → home | 600–900ms | crossfade/material dissolve |

No perpetual particle animation. Pause canvas/render work when the tab is hidden.

For `prefers-reduced-motion: reduce`:

- replace spatial motion with short opacity changes;
- show the reveal area without trailing animation;
- keep all content and interaction meaning;
- allow seal and letter actions to complete instantly after activation.

## 8. Input and responsive behavior

Desktop:

- Pointer is the reveal input.
- Do not draw a flashlight graphic.
- Use controlled target positions based on normalized viewport coordinates.

Mobile/tablet fallback:

- Touch reveal appears 20–35px above the finger.
- Radius 110–160px.
- Touch, drag and release must not trap page scrolling before discovery becomes active.
- At narrow widths, stack text above the physical object without turning the screen into a card column.

Keyboard:

- Tab reaches sound, skip and the active physical interaction.
- Enter/Space provides equivalent progression.
- Escape skips only after an accessible confirmation policy is decided; do not surprise the user.

## 9. Accessibility

- Essential text contrast must meet WCAG AA.
- `LAUME` is text or has a correct accessible name.
- State changes announce concise messages through one `aria-live="polite"` region.
- Seal hold uses an accessible progress value, even though the visual UI shows no percentage.
- Letter content is real selectable text.
- Canvas/WebGL layers are decorative and `aria-hidden`; semantic alternatives remain in the DOM.
- Sound is off until user interaction and the experience works completely muted.
- `Keşfi geç` remains visible, focusable and usable at every discovery state.

## 10. Performance and fallback

- Prefer CSS/SVG for paper, envelope, trace and seal geometry.
- Use WebGL only for fog if it materially improves quality.
- Provide a CSS radial-mask fallback when WebGL2 is unavailable.
- Respect device pixel ratio but cap expensive canvas resolution.
- Lazy-load the Home phone preview and non-critical textures.
- Avoid adding a new animation dependency unless the existing stack cannot meet a required interaction.

## 11. Analytics

Preserve existing event intent and rename/add only where necessary:

```text
web_discovery_started
web_trace_revealed
web_fragment_revealed
web_distance_changed
web_envelope_found
web_seal_hold_started
web_seal_completed
web_letter_pulled
web_letter_revealed
web_discovery_completed
web_discovery_skipped
web_home_cta_clicked
```

Do not send pointer coordinates, precise location or letter content.

## 12. Tests and acceptance gates

Add unit tests for every reducer transition and invalid transition. Add interaction tests for:

- first pointer movement starts discovery;
- controlled trace intersection advances exactly once;
- inactivity assist does not skip stages;
- distance reaches near state without reset;
- seal early release and successful hold;
- keyboard completion of seal and letter pull;
- skip from every state routes safely;
- completion persists and returning visitor reaches `/home`;
- replay query starts discovery again;
- reduced-motion path contains no required drag/hold barrier;
- direct legal/support/download/deep-link routes bypass discovery;
- visible brand copy contains no `Layar` remnants.

Before reporting completion run:

```text
npm run typecheck
npm run build
```

Also verify manually at 1440×900, 1280×720, 1024×768, 390×844 and 360×800; keyboard-only; 200% zoom; reduced motion; muted audio; WebGL disabled.

## 13. Implementation order

1. Reconcile CSS/TypeScript tokens and rename visible brand copy.
2. Expand and test the reducer.
3. Build shared discovery world, fog and reveal primitives.
4. Implement states 01–05.
5. Implement envelope, seal hold and break.
6. Implement letter pull/read/continuation.
7. Rebuild `/home` from `11-home.png`.
8. Add reduced-motion, keyboard and WebGL fallback paths.
9. Add analytics and persistence migration.
10. Run tests, build and the manual viewport matrix.

Do not mark the task complete if the pages merely resemble the screenshots. Completion requires real pointer/touch/keyboard behavior, responsive layout, reduced-motion behavior, direct-route bypass and passing build/typecheck.
