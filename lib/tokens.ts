/**
 * LAUME DESIGN TOKEN SYSTEM
 * Synced with app/globals.css `--laume-*` custom properties for programmatic,
 * canvas, and motion usage. Kaynak: CLAUDE_LAUME_DISCOVERY_BUILD_SPEC.md §3.
 */

export const colors = {
  bg: "#fbfaf7",
  surface: "#ffffff",
  paper: "#fffefb",
  paperEdge: "#ede9e1",
  ink: "#0f172a",
  muted: "#64748b",
  violet: "#7c3aed",
  violetPressed: "#6d28d9",
  violetSoft: "#ede9fe",
  amber: "#d7a65a",
  amberHigh: "#f0ce8d",
  fog: "rgba(255, 255, 255, 0.78)",
  fogDeep: "rgba(251, 250, 247, 0.96)",
  border: "rgba(15, 23, 42, 0.10)",
} as const;

export const motion = {
  duration: {
    micro: "150ms",
    settle: "260ms",
    surface: "400ms",
    text: "600ms",
    sealRitual: "950ms",
    stagger: "30ms",
  },
  easing: {
    default: "cubic-bezier(0.16, 1, 0.3, 1)",
    fade: "cubic-bezier(0.4, 0, 0.2, 1)",
    elastic: "cubic-bezier(0.175, 0.885, 0.32, 1.275)",
  },
} as const;

export const zIndex = {
  deep: -10,
  base: 0,
  fogCanvas: 1,
  trail: 5,
  content: 10,
  interactiveSeal: 20,
  header: 50,
  modalBackdrop: 90,
  modal: 100,
  toast: 200,
  bypass: 900,
  skipLink: 1000,
} as const;

export const containers = {
  sm: "640px",
  md: "768px",
  lg: "960px",
  xl: "1200px",
} as const;
