export function isInRange(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  rangeX: number,
  rangeY: number,
) {
  const dx = Math.abs(x1 - x2);
  const dy = Math.abs(y1 - y2);

  return dx <= rangeX && dy <= rangeY;
}
