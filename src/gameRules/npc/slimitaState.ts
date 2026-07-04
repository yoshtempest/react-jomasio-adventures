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
      phase1DashState: "idle",
      phase1DashStart: 0,
      phase1DashStartX: npc.x,
      phase1DashTargetX: npc.x,
      phase1DashHitDone: false,
    };
  }

  return npc.ai.slimita;
}
