type PlayerLike = Pick<Player, "gridX" | "gridY" | "direction">;

export function isPositionInFront(player: PlayerLike, x: number, y: number) {
  const { gridX: px, gridY: py, direction } = player;

  switch (direction) {
    case "right":
      return x > px && x <= px + 1 && Math.abs(y - py) <= 0.5;
    case "left":
      return x >= px - 1 && x < px && Math.abs(y - py) <= 0.5;
    case "down":
      return y > py && y <= py + 1 && Math.abs(x - px) <= 0.5;
    case "up":
      return y >= py - 1 && y < py && Math.abs(x - px) <= 0.5;
  }
}

export function parseGridKey(key: string): { x: number; y: number } | null {
  const [sx, sy] = key.split(",");
  const x = Number(sx);
  const y = Number(sy);
  if (!Number.isFinite(x) || !Number.isFinite(y)) return null;
  return { x, y };
}
