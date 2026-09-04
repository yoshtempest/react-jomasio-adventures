export function getBlockLimit(level: number, totalArmor: number): number {
  return 20 + level * 3 + totalArmor * 2;
}