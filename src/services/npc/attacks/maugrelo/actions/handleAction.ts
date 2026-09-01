import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "../state";
import {
  THROW_ACTIVE_DURATION,
  SLAP_ACTIVE_DURATION,
  PUSH_ACTIVE_DURATION,
} from "../state";

export function handleAction(
  ai: MaugreloAI,
  now: number,
  npcX: number,
  npcY: number,
  onMeleeHit: BehaviorContext["onMeleeHit"],
  onPushPlayer: BehaviorContext["onPushPlayer"],
  playSound: BehaviorContext["playSound"],
): BehaviorResult | null {
  if (ai.currentAction === "throw") {
    if (now - ai.actionStart >= THROW_ACTIVE_DURATION) {
      ai.actionState = "postAction";
      ai.actionStart = now;
    }
    return { x: npcX, y: npcY, state: "throw" as const };
  }

  if (ai.currentAction === "slap") {
    if (!ai.meleeHitTriggered) {
      ai.meleeHitTriggered = true;
      onMeleeHit();
      playSound?.("slap");
    }
    if (now - ai.actionStart >= SLAP_ACTIVE_DURATION) {
      ai.actionState = "postAction";
      ai.actionStart = now;
    }
    return { x: npcX, y: npcY, state: "slap" as const };
  }

  if (ai.currentAction === "push") {
    if (!ai.meleeHitTriggered) {
      ai.meleeHitTriggered = true;
      onPushPlayer?.(npcX);
      playSound?.("boom");
    }
    if (now - ai.actionStart >= PUSH_ACTIVE_DURATION) {
      ai.actionState = "postAction";
      ai.actionStart = now;
    }
    return { x: npcX, y: npcY, state: "push" as const };
  }

  return null;
}