import type { BehaviorResult } from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "../state";
import { POST_ACTION_COOLDOWN } from "../state";

export function handlePostAction(
  ai: MaugreloAI,
  now: number,
  npcX: number,
  npcY: number,
): BehaviorResult {
  if (now - ai.actionStart >= POST_ACTION_COOLDOWN) {
    ai.actionState = "idle";
    ai.currentAction = null;
  }
  return { x: npcX, y: npcY };
}