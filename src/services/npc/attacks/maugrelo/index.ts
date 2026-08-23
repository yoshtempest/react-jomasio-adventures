import { NpcAttack } from "../../npcAttack";
import { initMaugreloAi } from "./state";
import { maugreloPhase1 } from "./phase1";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

export class MaugreloAttack extends NpcAttack {
  constructor() {
    super("maugrelo");
  }

  execute(ctx: BehaviorContext): BehaviorResult {
    const { npc } = ctx;

    if (!npc.ai) npc.ai = {};
    if (!npc.ai.maugrelo) {
      npc.ai.maugrelo = initMaugreloAi();
    }

    const ai = npc.ai.maugrelo;

    return maugreloPhase1(ctx, ai);
  }
}
