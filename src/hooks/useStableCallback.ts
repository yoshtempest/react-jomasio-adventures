import { useRef, useCallback } from "react";

export function useStableCallback<F extends (...args: never[]) => unknown>(
  fn: F,
): F {
  const ref = useRef(fn);
  ref.current = fn;
  return useCallback((...args: Parameters<F>) => ref.current(...args), []) as F;
}
