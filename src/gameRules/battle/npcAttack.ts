export function canNpcAttack(
  distanceX: number,
  distanceY: number,
  lastAttack: number,
  cooldown: number,
) {
  const now = Date.now();

  return distanceX <= 20 && distanceY <= 39 && now - lastAttack > cooldown;
}
