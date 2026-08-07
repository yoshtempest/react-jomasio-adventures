type PlayerLike = Pick<Player, "gridX" | "gridY" | "direction">;

type NpcLike = { gridX: number; gridY: number };

export function isNpcInFront(player: PlayerLike, npc: NpcLike) {
  const { gridX: px, gridY: py, direction } = player;
  const { gridX: nx, gridY: ny } = npc;

  switch (direction) {
    case "right":
      return nx > px && nx <= px + 1 && Math.abs(ny - py) <= 0.5;
    case "left":
      return nx >= px - 1 && nx < px && Math.abs(ny - py) <= 0.5;
    case "down":
      return ny > py && ny <= py + 1 && Math.abs(nx - px) <= 0.5;
    case "up":
      return ny >= py - 1 && ny < py && Math.abs(nx - px) <= 0.5;
  }
}
