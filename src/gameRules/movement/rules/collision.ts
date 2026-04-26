export function canMoveTo(
  map: number[][],
  x: number,
  y: number
) {
  if (!map[y] || map[y][x] === undefined) return false;
  return map[y][x] === 0;
}