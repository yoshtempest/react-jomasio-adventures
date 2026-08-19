import { getChaseMovement } from "@/gameRules/movement/npc";
import type { NPCBattleState } from "@/utils/types/npc/npc";

export function chasePlayer(
  npc: NPCBattleState,
  playerX: number,
  playerY: number,
  speedMultiplier: number = 1,
) {
  return getChaseMovement(npc.x, npc.y, playerX, playerY, speedMultiplier);
}
