import { BATTLE_SPAWN } from "@/gameRules/battle/spawnPoints";
import type { BattleObstacle } from "@/utils/types/maps/battle";

export function getLandingY(
  prevY: number,
  newY: number,
  playerX: number,
  obstacles: BattleObstacle[],
): number {
  let best: number | null = null;
  for (const ob of obstacles) {
    const playerLeft = playerX + 10;
    const playerRight = playerX + 30;
    if (playerRight <= ob.x || playerLeft >= ob.x + ob.width) continue;

    const crossed = prevY <= ob.y && newY >= ob.y;
    if (!crossed) continue;

    if (best === null || ob.y > best) best = ob.y;
  }
  return best ?? BATTLE_SPAWN.npc.y;
}

export function getGroundAtX(
  feetY: number,
  playerX: number,
  obstacles: BattleObstacle[],
): number {
  let best: number | null = null;
  for (const ob of obstacles) {
    const playerLeft = playerX + 10;
    const playerRight = playerX + 30;
    if (playerRight <= ob.x || playerLeft >= ob.x + ob.width) continue;

    if (ob.y > feetY + 4 || ob.y + ob.height < feetY - 4) continue;

    if (best === null || ob.y > best) best = ob.y;
  }
  return best ?? BATTLE_SPAWN.npc.y;
}

export function isHorizontallyBlocked(
  playerLeft: number,
  playerTop: number,
  playerRight: number,
  playerBottom: number,
  obstacles: BattleObstacle[],
): boolean {
  for (const ob of obstacles) {
    if (ob.type === "platform") continue;
    if (
      playerRight > ob.x &&
      playerLeft < ob.x + ob.width &&
      playerBottom > ob.y &&
      playerTop < ob.y + ob.height
    ) {
      return true;
    }
  }
  return false;
}
