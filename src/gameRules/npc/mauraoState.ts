import type { NPCBattleState } from "@/utils/types/npc/npc";

export function getMauraoState(npc: NPCBattleState) {
  if (!npc.ai) npc.ai = {};

  if (!npc.ai.maurao) {
    npc.ai.maurao = {
      dashState: "idle",
      dashStart: 0,
      dashStartX: npc.x,
      dashTargetX: npc.x,
      dashHitDone: false,
      lastMeleeAttack: 0,
      postDashStart: 0,
      throwState: "idle",
      throwStart: 0,
      lastRangedAttack: 0,
    };
  }

  return npc.ai.maurao;
}
