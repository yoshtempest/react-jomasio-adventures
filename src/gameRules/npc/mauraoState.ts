import type { NPCBattleState } from "@/utils/types/npc/npc";

export type MauraoAIState = Required<Exclude<NPCBattleState["ai"], undefined>>["maurao"];

export function getMauraoState(npc: NPCBattleState): MauraoAIState {
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
      spinState: "idle",
      spinStart: 0,
      spinRestStart: 0,
      lastSpinHit: 0,
      spinHitCount: 0,
    };
  }

  return npc.ai.maurao;
}
