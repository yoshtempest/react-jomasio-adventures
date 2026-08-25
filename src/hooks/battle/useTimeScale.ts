import { useRef, useCallback } from "react";

export function useTimeScale() {
  const timeScaleRef = useRef(1);

  const setTimeScale = useCallback((scale: number) => {
    timeScaleRef.current = Math.max(0.01, Math.min(1, scale));
  }, []);

  const resetTimeScale = useCallback(() => {
    timeScaleRef.current = 1;
  }, []);

  return {
    timeScaleRef,
    setTimeScale,
    resetTimeScale,
  } as const;
}
