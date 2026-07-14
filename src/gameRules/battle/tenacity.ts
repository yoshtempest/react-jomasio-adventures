const TENACITY_K = 50;

export function getTenacityReduction(totalTenacity: number): number {
  if (totalTenacity <= 0) return 0;
  return totalTenacity / (totalTenacity + TENACITY_K);
}
