export function rollCrit(
  damage: number,
  critRate: number,
): { damage: number; type: DamageType } {
  if (Math.random() * 100 < critRate) {
    return { damage: damage * 2, type: "crit" };
  }
  return { damage, type: "player" };
}
