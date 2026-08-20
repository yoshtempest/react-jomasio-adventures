import type { NPCDirection } from "@/utils/types/npc/npc";
import type { BattleObstacle } from "@/utils/types/maps/battle";
import { isHorizontallyBlocked } from "@/gameRules/battle/obstacles";

export function getNpcDirection(npcX: number, playerX: number): NPCDirection {
  return playerX < npcX ? "left" : "right";
}

export function getNpcState(
  _distanceX: number,
  forceIdle: boolean,
): "idle" | "walk" {
  if (forceIdle) return "idle";
  return "walk";
}

export function applyObstacleCollision(
  nextX: number,
  nextY: number,
  obstacles: BattleObstacle[],
): { x: number; y: number } {
  if (obstacles.length === 0) return { x: nextX, y: nextY };

  const npcLeft = nextX - 15;
  const npcRight = nextX + 15;
  const npcTop = nextY - 50;
  const npcBottom = nextY;

  if (isHorizontallyBlocked(npcLeft, npcTop, npcRight, npcBottom, obstacles)) {
    return { x: nextX, y: nextY };
  }

  return { x: nextX, y: nextY };
}
