import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "../state";
import { PRE_MOVE_DURATION } from "../state";
import { spawnFlyingPaper } from "../papers";

export function handlePreMove(
  ai: MaugreloAI,
  now: number,
  npcX: number,
  npcY: number,
  playerX: number,
  playSound: BehaviorContext["playSound"],
): BehaviorResult {
  ai.walkingStartTime = 0;
  ai.meleeHitTriggered = false;

  if (now - ai.actionStart >= PRE_MOVE_DURATION) {
    ai.actionState = "action";
    ai.actionStart = now;

    if (ai.currentAction === "throw") {
      spawnFlyingPaper(npcX, npcY, playerX, ai);
      playSound?.("throwPaper");
    }
  }

  return { x: npcX, y: npcY, state: "preMove" as const };
}