export type DamageTarget = {
  x: number;
  y: number;
  h: number;
};

export function findDamageTarget(
  x: number,
  y: number,
  targets: DamageTarget[],
): DamageTarget | undefined {
  let best: DamageTarget | undefined;
  let bestDist = Infinity;
  for (const t of targets) {
    const dx = t.x - x;
    const dy = t.y - y;
    const dist = dx * dx + dy * dy;
    if (dist < bestDist) {
      bestDist = dist;
      best = t;
    }
  }
  return best;
}
