import type { NPCBattleState } from "@/utils/types/npc/npc";

export function getSlimitaState(npc: NPCBattleState, playerX: number) {
  const now = Date.now();

  if (!npc.ai) npc.ai = {};

  if (!npc.ai.slimita) {
    npc.ai.slimita = {
      state: "idle",
      startTime: now,
      targetX: playerX,
      lastPullThrow: 0,
    };
  }

  return npc.ai.slimita;
}
