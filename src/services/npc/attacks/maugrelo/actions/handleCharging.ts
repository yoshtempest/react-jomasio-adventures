import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "../state";
import { PHASE2_CHARGE_SPEED, PUSH_RANGE } from "../state";

export function handleCharging(
  ai: MaugreloAI,
  ctx: BehaviorContext,
  now: number,
): BehaviorResult {
  const { npc } = ctx;

  const distanceX = Math.abs(npc.x - ctx.playerX);

  if (distanceX <= PUSH_RANGE) {
    ai.phase2State = "push";
    ai.phase2StageStart = now;
    ai.pushHitTriggered = false;
    return { x: npc.x, y: ai.riseStartY, state: "push" };
  }

  const direction = ctx.playerX >= npc.x ? 1 : -1;
  return {
    x: npc.x + direction * PHASE2_CHARGE_SPEED,
    y: ai.riseStartY,
    state: "run",
  };
}
