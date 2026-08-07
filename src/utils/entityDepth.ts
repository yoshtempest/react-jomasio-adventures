export function getEntityZIndex(gridY: number): number {
  return 10 + Math.round(gridY * 10);
}
