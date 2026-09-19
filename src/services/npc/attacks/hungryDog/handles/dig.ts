import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

import {
  DIG_DIG_MS,
  DIG_ENTERING_MS,
  DIG_TOTAL_MS,
  type HungryDogAI,
} from "../state";

export function handleDig(
    ctx: BehaviorContext,
    ai: HungryDogAI,
    now: number,
): BehaviorResult {
    const { npc } = ctx;
    const elapsed = now - ai.phaseStart;

    if (elapsed >= DIG_TOTAL_MS) {
        ai.phase = "underground";
        ai.phaseStart = now;
        return { x: npc.x, y: npc.y, state: "entered", hidden: true };
    }

    if (elapsed < DIG_DIG_MS) {
        return { x: npc.x, y: npc.y, state: "dig" };
    }

    if (elapsed < DIG_DIG_MS + DIG_ENTERING_MS) {
        return { x: npc.x, y: npc.y, state: "entering" };
    }

    return { x: npc.x, y: npc.y, state: "entered" };
}