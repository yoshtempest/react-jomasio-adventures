import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import {
  INTRO_MS,
  INTRO_SUMMON_COUNT,
  type HungryDogAI,
} from "../state";


export function handleIntro(
    ctx: BehaviorContext,
    ai: HungryDogAI,
    now: number,
  ): BehaviorResult {
    if (now - ai.phaseStart >= INTRO_MS) {
      ai.phase = "chase";
      ai.phaseStart = now;
      ai.introEnd = now;
      return { x: ctx.npc.x, y: ctx.npc.y, state: "idle", hidden: false };
    }

    if (!ai.introSummoned) {
      ai.introSummoned = true;
      for (let i = 0; i < INTRO_SUMMON_COUNT; i += 1) {
        ctx.onSummonFromRight?.("hungryDog");
      }
    }

    return { x: ctx.npc.x, y: ctx.npc.y, state: "invoking", hidden: false };
  }