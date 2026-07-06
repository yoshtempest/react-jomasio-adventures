import type { BehaviorContext, BehaviorResult } from "@/utils/types/npc/npcBehavior";
import { initMauraoAi, handlePhaseChange } from "./state";
import { mauraoPhase1 } from "./phase1";
import { mauraoPhase2 } from "./phase2";

export function mauraoBehavior(
  ctx: BehaviorContext,
): BehaviorResult {
  const { npc, npcPhase } = ctx;

  if (!npc.ai) npc.ai = {};
  if (!npc.ai.maurao) {
    npc.ai.maurao = initMauraoAi(npcPhase);
  }

  const ai = npc.ai.maurao;

  if (npcPhase !== ai.knownPhase) {
    handlePhaseChange(ai, npcPhase);
  }

  if (npcPhase === 2) {
    return mauraoPhase2(ctx, ai);
  }

  return mauraoPhase1(ctx, ai);
}
