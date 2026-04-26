import { canMoveTo } from "@/gameRules/movement/rules/collision";
import { GRID_STEP } from "@/gameRules/movement/constants/movement";
import type { Player } from "@/utils/types/player/player";

export function moveExplore(
  player: Player,
  map: number[][],
  direction: "up" | "down" | "left" | "right"
): Player {
  if (player.mode !== "explore") return player;

  let newX = player.gridX;
  let newY = player.gridY;

  if (direction === "up") newY -= GRID_STEP;
  if (direction === "down") newY += GRID_STEP;
  if (direction === "left") newX -= GRID_STEP;
  if (direction === "right") newX += GRID_STEP;

  if (!canMoveTo(map, newX, newY)) {
    return { ...player, direction };
  }

  return {
    ...player,
    gridX: newX,
    gridY: newY,
    direction,
  };
}