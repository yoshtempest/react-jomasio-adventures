export function canAttack(
  lastAttackRef: React.RefObject<number>,
  cooldown: number,
) {
  return Date.now() - lastAttackRef.current > cooldown;
}

export function registerAttack(lastAttackRef: React.RefObject<number>) {
  lastAttackRef.current = Date.now();
}

export function getDistance(x1: number, y1: number, x2: number, y2: number) {
  return Math.hypot(x1 - x2, y1 - y2);
}

export function isNear(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  radius: number,
) {
  return getDistance(x1, y1, x2, y2) <= radius;
}
