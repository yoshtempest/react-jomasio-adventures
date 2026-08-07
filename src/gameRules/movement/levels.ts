export const MAX_STEP_UP = 1;

export const HEIGHT_STEP_OFFSET = 0.5;

export function getTileHeight(
  heightMap: number[][] | undefined,
  x: number,
  y: number,
) {
  return heightMap?.[y]?.[x] ?? 0;
}

export function canStepTo(
  playerHeight: number,
  heightMap: number[][] | undefined,
  x: number,
  y: number,
) {
  const targetHeight = getTileHeight(heightMap, x, y);
  return targetHeight <= playerHeight + MAX_STEP_UP;
}
