const LUCK_K = 199;

export function getLuckBonus(totalLuck: number): number {
  if (totalLuck <= 0) return 0;
  return totalLuck / (totalLuck + LUCK_K);
}
