import { NpcAttack } from "../../npcAttack";
import { initHungryKingAi, handlePhaseChange } from "./state";
import { hungryKingPhase1 } from "./phase1";
import { hungryKingPhase2 } from "./phase2";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

export class HungryKingAttack extends NpcAttack {
  constructor() {
    super("hungryKing");
  }

  execute(ctx: BehaviorContext): BehaviorResult {
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
}
