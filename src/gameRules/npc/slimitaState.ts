import type { NPCBattleState } from "@/utils/types/npc/npc";

export function getSlimitaState(
  npc: NPCBattleState,
  playerX: number
) {
  const now = Date.now();

  if (!npc.ai) npc.ai = {};

  if (!npc.ai.slimita) {
    npc.ai.slimita = {
      state: "idle",
      startTime: now,
      baseY: npc.y,
      targetX: playerX,
    };
  }

  return npc.ai.slimita;
}