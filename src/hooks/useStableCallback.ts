import { useCallback } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";

export function useStableCallback<F extends (...args: never[]) => unknown>(
  fn: F,
): F {
  const ref = useLatestRef(fn);
  return useCallback((...args: Parameters<F>) => ref.current(...args), [
    ref,
  ]) as F;
}
