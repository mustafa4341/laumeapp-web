/**
 * LAUME DISCOVERY STATE MACHINE
 * Pure, deterministic reducer for the 12-stage discovery experience.
 * Kaynak: CLAUDE_LAUME_DISCOVERY_BUILD_SPEC.md §4.
 */

import { trackEvent } from "./analytics";

export type DiscoveryState =
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

export type DiscoveryAction =
  | { type: "START_EXPLORING" }
  | { type: "FOUND_TRACE" }
  | { type: "FOUND_FRAGMENT" }
  | { type: "APPROACH_TARGET"; meters?: number }
  | { type: "ENTER_NEAR_RANGE" }
  | { type: "FOUND_ENVELOPE" }
  | { type: "START_SEAL_HOLD" }
  | { type: "UPDATE_SEAL_HOLD"; progress: number }
  | { type: "BREAK_SEAL"; method?: "hold" | "keyboard" }
  | { type: "UPDATE_LETTER_PULL"; progress: number }
  | { type: "REVEAL_LETTER" }
  | { type: "SHOW_CONTINUATION" }
  | { type: "FINISH_DISCOVERY" }
  | { type: "SKIP" }
  | { type: "RESTART" };

export interface DiscoveryMachineState {
  current: DiscoveryState;
  history: DiscoveryState[];
  distanceMeters: number;
  sealHoldProgress: number;
  letterPullProgress: number;
  startedAt: number | null;
}

export const INITIAL_DISCOVERY_STATE: DiscoveryMachineState = {
  current: "arrival",
  history: [],
  distanceMeters: 18,
  sealHoldProgress: 0,
  letterPullProgress: 0,
  startedAt: null,
};

const STORAGE_KEY = "laume_discovery_completed";
/** Eski anahtar — göç okumaları için korunur (spec §4). */
const LEGACY_STORAGE_KEY = "layar_discovery_completed";

export function getStoredDiscoveryStatus(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return (
      window.localStorage.getItem(STORAGE_KEY) === "true" ||
      window.localStorage.getItem(LEGACY_STORAGE_KEY) === "true"
    );
  } catch {
    return false;
  }
}

export function setStoredDiscoveryStatus(completed: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, completed ? "true" : "false");
  } catch {
    // Storage access may be denied in strict iframe/private browsing modes
  }
}

function push(state: DiscoveryMachineState): DiscoveryState[] {
  return [...state.history, state.current];
}

export function discoveryReducer(
  state: DiscoveryMachineState,
  action: DiscoveryAction
): DiscoveryMachineState {
  switch (action.type) {
    case "START_EXPLORING": {
      if (state.current !== "arrival" && state.current !== "skipped") return state;
      trackEvent({ name: "web_discovery_started" });
      return {
        ...state,
        current: "trace",
        history: push(state),
        startedAt: Date.now(),
      };
    }

    case "FOUND_TRACE": {
      if (state.current !== "trace") return state;
      trackEvent({ name: "web_trace_revealed" });
      return { ...state, current: "fragment", history: push(state) };
    }

    case "FOUND_FRAGMENT": {
      if (state.current !== "fragment") return state;
      trackEvent({ name: "web_fragment_revealed" });
      return {
        ...state,
        current: "approaching",
        history: push(state),
        distanceMeters: 18,
      };
    }

    case "APPROACH_TARGET": {
      // "near" is a settled milestone once reached (often via the keyboard
      // shortcut, independent of real pointer position) — further pointer-
      // driven proximity updates must never demote it back to "approaching".
      if (state.current !== "approaching") return state;
      const newMeters = Math.max(2, action.meters ?? state.distanceMeters - 3);
      trackEvent({ name: "web_distance_changed", payload: { meters: newMeters } });

      if (newMeters <= 2) {
        return { ...state, current: "near", history: push(state), distanceMeters: 2 };
      }
      return { ...state, current: "approaching", distanceMeters: newMeters };
    }

    case "ENTER_NEAR_RANGE": {
      if (state.current !== "approaching" && state.current !== "near") return state;
      return {
        ...state,
        current: "near",
        history: push(state),
        distanceMeters: 2,
      };
    }

    case "FOUND_ENVELOPE": {
      if (state.current !== "near") return state;
      trackEvent({ name: "web_envelope_found" });
      return { ...state, current: "seal-ready", history: push(state) };
    }

    case "START_SEAL_HOLD": {
      if (state.current !== "seal-ready") return state;
      trackEvent({ name: "web_seal_hold_started" });
      return {
        ...state,
        current: "seal-hold",
        history: push(state),
        sealHoldProgress: 0,
      };
    }

    case "UPDATE_SEAL_HOLD": {
      if (state.current !== "seal-hold") return state;
      return { ...state, sealHoldProgress: Math.min(1, Math.max(0, action.progress)) };
    }

    case "BREAK_SEAL": {
      if (state.current !== "seal-hold" && state.current !== "seal-ready") return state;
      trackEvent({ name: "web_seal_completed", payload: { method: action.method ?? "hold" } });
      return {
        ...state,
        current: "letter-pull",
        history: push(state),
        sealHoldProgress: 1,
        letterPullProgress: 0,
      };
    }

    case "UPDATE_LETTER_PULL": {
      if (state.current !== "letter-pull") return state;
      return { ...state, letterPullProgress: Math.min(1, Math.max(0, action.progress)) };
    }

    case "REVEAL_LETTER": {
      if (state.current !== "letter-pull") return state;
      trackEvent({ name: "web_letter_pulled" });
      trackEvent({ name: "web_letter_revealed" });
      return {
        ...state,
        current: "letter-read",
        history: push(state),
        letterPullProgress: 1,
      };
    }

    case "SHOW_CONTINUATION": {
      if (state.current !== "letter-read") return state;
      return { ...state, current: "continuation", history: push(state) };
    }

    case "FINISH_DISCOVERY": {
      setStoredDiscoveryStatus(true);
      const durationMs = state.startedAt ? Date.now() - state.startedAt : undefined;
      trackEvent({ name: "web_discovery_completed", payload: { durationMs } });
      return { ...state, current: "completed", history: push(state) };
    }

    case "SKIP": {
      trackEvent({ name: "web_discovery_skipped", payload: { fromState: state.current } });
      setStoredDiscoveryStatus(true);
      return { ...state, current: "skipped", history: push(state) };
    }

    case "RESTART": {
      return { ...INITIAL_DISCOVERY_STATE, history: [...state.history, state.current] };
    }

    default:
      return state;
  }
}
