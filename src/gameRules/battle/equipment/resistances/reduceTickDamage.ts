export function reduceTickDamage(base: number, resistancePct: number): number {
  return Math.max(1, Math.round(base * (1 - resistancePct / 100)));
}