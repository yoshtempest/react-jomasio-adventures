import { NpcAttack } from "../../npcAttack";
import { getSlimitaState } from "@/gameRules/npc/slimitaState";
import { handlePhase1 } from "./phase1";
import { handlePhase2 } from "./phase2";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

export class SlimitaAttack extends NpcAttack {
  constructor() {
    super("slimita");
  }

  execute(ctx: BehaviorContext): BehaviorResult {
    const now = Date.now();

    const state = getSlimitaState(ctx.npc, ctx.targetX);

    if (ctx.npcPhase === 1) {
      return handlePhase1(ctx, state, now);
    }

    return handlePhase2(ctx, state, now);
  }
}
