import { canMoveTo } from "@/gameRules/movement/collision";
import { canStepTo, getTileHeight } from "@/gameRules/movement/levels";

export const EXPLORE_MOVE_INTERVAL = 300;

function tryMove(
  player: Player,
  map: number[][],
  heightMap: number[][] | undefined,
  direction: Direction,
  step: number,
): { moved: boolean; newX: number; newY: number } {
  let newX = player.gridX;
  let newY = player.gridY;

  if (direction === "up") newY -= step;
  if (direction === "down") newY += step;
  if (direction === "left") newX -= step;
  if (direction === "right") newX += step;

  if (!canMoveTo(map, newX, newY) || !canStepTo(player.height, heightMap, newX, newY)) {
    return { moved: false, newX: player.gridX, newY: player.gridY };
  }

  // when moving multiple tiles, check every intermediate tile too
  if (step > 1) {
    for (let s = 1; s < step; s++) {
      let ix = player.gridX;
      let iy = player.gridY;
      if (direction === "up") iy -= s;
      if (direction === "down") iy += s;
      if (direction === "left") ix -= s;
      if (direction === "right") ix += s;
      if (!canMoveTo(map, ix, iy) || !canStepTo(player.height, heightMap, ix, iy)) {
        return { moved: false, newX: player.gridX, newY: player.gridY };
      }
    }
  }

  return { moved: true, newX, newY };
}

export function moveExplore(
  player: Player,
  map: number[][],
  direction: Direction,
  heightMap?: number[][],
): Player {
  if (player.mode !== "explore") return player;

  if (player.hasPeru) {
    const double = tryMove(player, map, heightMap, direction, 2);
    if (double.moved) {
      return {
        ...player,
        gridX: double.newX,
        gridY: double.newY,
        height: getTileHeight(heightMap, double.newX, double.newY),
        direction,
        moving: true,
      };
    }
    const single = tryMove(player, map, heightMap, direction, 1);
    if (single.moved) {
      return {
        ...player,
        gridX: single.newX,
        gridY: single.newY,
        height: getTileHeight(heightMap, single.newX, single.newY),
        direction,
        moving: true,
      };
    }
    return { ...player, direction, moving: false };
  }

  const result = tryMove(player, map, heightMap, direction, 1);
  if (result.moved) {
    return {
      ...player,
      gridX: result.newX,
      gridY: result.newY,
      height: getTileHeight(heightMap, result.newX, result.newY),
      direction,
      moving: true,
    };
  }
  return { ...player, direction, moving: false };
}
