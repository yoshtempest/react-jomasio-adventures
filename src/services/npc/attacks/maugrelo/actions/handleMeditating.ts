import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "../state";
import {
  MELEE_SWITCH_DISTANCE,
  MEDITATION_ARMOR_INTERVAL,
} from "../state";

export function handleMeditating(
  ai: MaugreloAI,
  now: number,
  npcX: number,
  npcY: number,
  distanceX: number,
  onArmorBuff: BehaviorContext["onArmorBuff"],
): BehaviorResult {
  if (distanceX <= MELEE_SWITCH_DISTANCE) {
    ai.actionState = "preMove";
    ai.actionStart = now;
    ai.currentAction = "slap";
    ai.lastSlap = now;
    return { x: npcX, y: npcY, state: "preMove" as const };
  }

  if (now - ai.lastArmorBuff >= MEDITATION_ARMOR_INTERVAL) {
    ai.meditationArmorBonus += 1;
    ai.lastArmorBuff = now;
    onArmorBuff?.(npcX, npcY);
  }

  return { x: npcX, y: npcY, state: "meditating" as const };
}