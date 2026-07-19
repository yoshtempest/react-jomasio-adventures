import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import { initHungryKingAi, handlePhaseChange } from "./state";
import { hungryKingPhase1 } from "./phase1";
import { hungryKingPhase2 } from "./phase2";

export function hungryKingBehavior(ctx: BehaviorContext): {
  x: number;
  y: number;
  state?: NPCBattleState["state"];
} {
  const { npc, npcPhase } = ctx;

  if (!npc.ai) npc.ai = {};
  if (!npc.ai.hungryKing) {
    npc.ai.hungryKing = initHungryKingAi(npcPhase);
  }

  const ai = npc.ai.hungryKing;

  if (npcPhase !== ai.knownPhase) {
    handlePhaseChange(ai, npcPhase);
  }

  if (npcPhase === 2) {
    return hungryKingPhase2(ctx, ai);
  }

  return hungryKingPhase1(ctx, ai);
}
