import { createCommonProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "../state";
import {
  PHASE2_THROW_PAPER_INTERVAL,
  PHASE2_THROW_PAPER_COUNT,
} from "../state";

export function handleThrowPapers(
  ai: MaugreloAI,
  ctx: BehaviorContext,
  now: number,
): BehaviorResult {
  const { npc } = ctx;

  if (
    ai.papersThrownCount < PHASE2_THROW_PAPER_COUNT &&
    now - ai.lastPaperThrow >= PHASE2_THROW_PAPER_INTERVAL
  ) {
    ai.papersThrownCount += 1;
    ai.lastPaperThrow = now;
    ctx.playSound?.("whooshWind");
    ctx.setProjectile(
      createCommonProjectile({
        startX: npc.x,
        startY: ai.riseStartY - 80,
        targetX: ctx.playerX,
        targetY: ctx.playerY,
        sprite: "paper",
        state: "idle",
        canCrouchDodge: true,
        landsOnGround: true,
      }),
    );
  }

  if (ai.papersThrownCount >= PHASE2_THROW_PAPER_COUNT) {
    ai.phase2State = "charging";
    ai.phase2StageStart = now;
    return { x: npc.x, y: ai.riseStartY, state: "charging" };
  }

  return { x: npc.x, y: ai.riseStartY, state: "throwPapers" };
}
