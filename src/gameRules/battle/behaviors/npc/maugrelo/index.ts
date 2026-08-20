import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import { initMaugreloAi } from "./state";
import { maugreloPhase1 } from "./phase1";

export function maugreloBehavior(ctx: BehaviorContext): BehaviorResult {
  const { npc } = ctx;

  if (!npc.ai) npc.ai = {};
  if (!npc.ai.maugrelo) {
    npc.ai.maugrelo = initMaugreloAi();
  }

  const ai = npc.ai.maugrelo;

  return maugreloPhase1(ctx, ai);
}
