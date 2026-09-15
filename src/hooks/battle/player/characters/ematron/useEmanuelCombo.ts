import { useCallback, useRef } from "react";

import {
  EMANUEL_COMBO_STEPS,
  EMANUEL_COMBO_WINDOW_MS,
  type EmanuelComboStep,
} from "@/data/characters/emanuel";

export function useEmanuelCombo() {
  const stepIndexRef = useRef(0);
  const lastPressAtRef = useRef(0);
  const multiplierRef = useRef(1);
  const airActiveRef = useRef(false);
  const activeRef = useRef(false);

  const advance = useCallback((now: number): EmanuelComboStep => {
    const withinWindow =
      now - lastPressAtRef.current <= EMANUEL_COMBO_WINDOW_MS;
    const nextIndex = withinWindow
      ? (stepIndexRef.current + 1) % EMANUEL_COMBO_STEPS.length
      : 0;
    const step = EMANUEL_COMBO_STEPS[nextIndex] ?? EMANUEL_COMBO_STEPS[0];
    stepIndexRef.current = nextIndex;
    multiplierRef.current = step.multiplier;
    lastPressAtRef.current = now;
    return step;
  }, []);

  const reset = useCallback(() => {
    stepIndexRef.current = 0;
    multiplierRef.current = 1;
    lastPressAtRef.current = 0;
    airActiveRef.current = false;
    activeRef.current = false;
  }, []);

  return {
    steps: EMANUEL_COMBO_STEPS,
    stepIndexRef,
    lastPressAtRef,
    multiplierRef,
    airActiveRef,
    activeRef,
    advance,
    reset,
  };
}

export type EmanuelComboApi = ReturnType<typeof useEmanuelCombo>;