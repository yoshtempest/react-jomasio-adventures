import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import { initDeiseAi, handlePhaseChange } from "./state";
import { deisePhase1 } from "./phase1";
import { deisePhase2 } from "./phase2";

export function deiseBehavior(
  ctx: BehaviorContext,
): { x: number; y: number; state?: NPCBattleState["state"] } {
  const { npc, npcPhase } = ctx;

  if (!npc.ai) npc.ai = {};
  if (!npc.ai.deise) {
    npc.ai.deise = initDeiseAi(npcPhase);
  }

  const ai = npc.ai.deise;

  if (npcPhase !== ai.knownPhase) {
    handlePhaseChange(ai, npcPhase);
  }

  if (npcPhase === 2) {
    return deisePhase2(ctx, ai);
  }

  return deisePhase1(ctx, ai);
}
