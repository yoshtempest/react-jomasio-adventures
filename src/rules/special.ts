export function getMaxSpecial(playerClass: string | null) {
  return playerClass === "fracote" ? 5 : 6;
}

export function gainSpecial(current: number, max: number) {
  return Math.min(current + 1, max);
}