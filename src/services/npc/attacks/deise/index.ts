import { NpcAttack } from "../../npcAttack";
import { initDeiseAi, handlePhaseChange } from "./state";
import { deisePhase1 } from "./phase1";
import { deisePhase2 } from "./phase2";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

export class DeiseAttack extends NpcAttack {
  constructor() {
    super("deise");
  }

  execute(ctx: BehaviorContext): BehaviorResult {
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
}
