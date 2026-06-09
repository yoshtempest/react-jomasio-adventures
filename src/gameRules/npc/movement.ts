import { getChaseMovement } from "@/gameRules/movement/npc";
import type { NPCBattleState } from "@/utils/types/npc/npc";

export function chasePlayer(
  npc: NPCBattleState,
  playerX: number,
  playerY: number
) {
  return getChaseMovement(
    npc.x,
    npc.y,
    playerX,
    playerY
  );
}