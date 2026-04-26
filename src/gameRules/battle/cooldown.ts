export function canUse(lastTime: number, cooldown: number) {
  return Date.now() - lastTime >= cooldown;
}