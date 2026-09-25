export function timeSinceParryInput(
  ...pressRefs: (React.RefObject<number> | undefined)[]
): number {
  const now = Date.now();
  let elapsed = Infinity;

  for (const ref of pressRefs) {
    const pressTime = ref?.current ?? 0;
    if (pressTime <= 0) continue;
    elapsed = Math.min(elapsed, now - pressTime);
  }

  return elapsed;
}