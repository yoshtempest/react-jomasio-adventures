export function gainSpecialCharge(
  current: number,
  playerClass: string
) {
  const max = playerClass === "fracote" ? 5 : 6;

  return Math.min(current + 1, max);
}