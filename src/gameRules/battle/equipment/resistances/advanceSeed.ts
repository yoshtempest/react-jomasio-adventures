export function advanceSeed(seed: number, steps: number): number {
  let s = seed;
  for (let i = 0; i < steps; i++) {
    s = (s * 1103515245 + 12345) & 0x7fffffff;
  }
  return s;
}