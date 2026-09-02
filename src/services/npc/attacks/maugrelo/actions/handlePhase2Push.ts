import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "../state";
import { PHASE2_PUSH_ACTIVE_DURATION } from "../state";

export function handlePhase2Push(
  ai: MaugreloAI,
  ctx: BehaviorContext,
  now: number,
): BehaviorResult {
  const { npc } = ctx;

  if (!ai.pushHitTriggered) {
    ai.pushHitTriggered = true;
    ctx.playSound?.("slap");
    ctx.onPushPlayer?.(npc.x);
  }

  if (now - ai.phase2StageStart >= PHASE2_PUSH_ACTIVE_DURATION) {
    ai.phase2State = "rising";
    ai.phase2StageStart = now;
    ai.riseStartY = npc.y;
    ai.flyingPaper = null;
    return { x: npc.x, y: ai.riseStartY, state: "flying" };
  }

  return { x: npc.x, y: ai.riseStartY, state: "push" };
}
