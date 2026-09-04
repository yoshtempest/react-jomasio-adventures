export function reduceDurationByResistance(
  baseMs: number,
  resistancePct: number,
): number {
  return Math.round(baseMs * (1 - resistancePct / 100));
}