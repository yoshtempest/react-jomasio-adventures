import { getBehindPlayerX } from "@/gameRules/npc/movement";
import { clampX } from "../clampX";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import {
  BEHIND_OFFSET,
  UNDERGROUND_MS,
  type HungryDogAI,
} from "../state";

export function handleUnderground(
    ctx: BehaviorContext,
    ai: HungryDogAI,
    now: number,
  ): BehaviorResult {
    const { npc, playerX, playerDirection } = ctx;
    const elapsed = now - ai.phaseStart;

    if (elapsed >= UNDERGROUND_MS) {
      ai.phase = "emerge";
      ai.phaseStart = now;
      ai.emergeFromX = clampX(
        getBehindPlayerX(playerX, playerDirection, BEHIND_OFFSET),
      );
      ai.emergeBaseY = npc.y;
      return {
        x: ai.emergeFromX,
        y: ai.emergeBaseY,
        state: "jumping",
        hidden: false,
      };
    }

    return { x: npc.x, y: npc.y, state: "entered", hidden: true };
  }