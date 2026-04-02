type Direction = "up" | "down" | "left" | "right";

type Player = {
  gridX: number;
  gridY: number;
  direction: Direction;
};

export function getTileInFront(player: Player, map: number[][]) {
  let x = player.gridX;
  let y = player.gridY;

  switch (player.direction) {
    case "up":
      y -= 1;
      break;
    case "down":
      y += 1;
      break;
    case "left":
      x -= 1;
      break;
    case "right":
      x += 1;
      break;
  }

  const tile = map[y]?.[x];

  return { x, y, tile };
}