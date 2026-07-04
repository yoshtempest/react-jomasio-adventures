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
      lastMeleeAttack: 0,
      lastRangedAttack: 0,
      phase1HopState: "ground",
      phase1HopStart: now,
      phase1HopStartX: npc.x,
      phase1BaseY: npc.y,
    };
  }

  return npc.ai.slimita;
}
