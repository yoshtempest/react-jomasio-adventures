import { NpcAttack } from "@/services/npc/npcAttack";
import {
  initMaugreloAi,
  handlePhaseChange,
} from "./state";
import { maugreloPhase1 } from "./phase1";
import { maugreloPhase2 } from "./phase2";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

export class MaugreloAttack extends NpcAttack {
  constructor() {
    super("maugrelo");
  }

  execute(ctx: BehaviorContext): BehaviorResult {
    const { npc, npcPhase } = ctx;

    if (!npc.ai) npc.ai = {};
    if (!npc.ai.maugrelo) {
      npc.ai.maugrelo = initMaugreloAi(npcPhase);
    }

    const ai = npc.ai.maugrelo;

    if (npcPhase !== ai.knownPhase) {
      handlePhaseChange(ai, npcPhase);
    }

    if (npcPhase === 2) {
      return maugreloPhase2(ctx, ai);
    }

    return maugreloPhase1(ctx, ai);
  }
}
