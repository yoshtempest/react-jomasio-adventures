import { chasePlayer } from "@/gameRules/npc/movement";
import { isNear } from "@/gameRules/npc/behavior";

import type { NPCBattleState } from "@/utils/types/npc/npc";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

import type { MauraoAI } from "./state";
import {
  SPIN_DURATION,
  SPIN_CYCLE_DURATION,
  SPIN_HIT_INTERVAL,
  SPIN_MELEE_RANGE,
  SPIN_REST_DURATION,
  SPIN_MOVE_SPEED,
  SPIN_CYCLE_START_THRESHOLD,
  SPIN_CYCLE_END_THRESHOLD,
} from "./state";

export function mauraoPhase2(
  ctx: BehaviorContext,
  ai: MauraoAI,
): BehaviorResult {
  const now = Date.now();
  const { npc, playerX, playerY, targetX, onMeleeHit } = ctx;

  if (ai.spinState === "spinning") {
    const elapsed = now - ai.spinStart;

    if (elapsed >= SPIN_DURATION) {
      ai.spinState = "resting";
      ai.spinRestStart = now;
      return { x: npc.x, y: npc.y, state: "finishSpin" as const };
    }

    const dx = targetX - npc.x;
    const step = Math.min(Math.abs(dx), SPIN_MOVE_SPEED);
    const newX = npc.x + Math.sign(dx) * step;

    if (now - ai.lastSpinHit >= SPIN_HIT_INTERVAL) {
      ai.lastSpinHit = now;
      if (isNear(newX, npc.y, playerX, playerY, SPIN_MELEE_RANGE)) {
        ctx.playSound?.("knifeAttack");
        onMeleeHit();
        ai.spinHitCount++;
      }
    }

    const cycleElapsed = elapsed % SPIN_CYCLE_DURATION;
    let animState: NPCBattleState["state"];
    if (cycleElapsed < SPIN_CYCLE_START_THRESHOLD) {
      animState = "startSpin";
    } else if (cycleElapsed >= SPIN_CYCLE_DURATION - SPIN_CYCLE_END_THRESHOLD) {
      animState = "finishSpin";
    } else {
      animState = "inSpin";
    }

    return { x: newX, y: npc.y, state: animState };
  }

  if (ai.spinState === "resting") {
    if (now - ai.spinRestStart >= SPIN_REST_DURATION) {
      ai.spinState = "idle";
    }

    return { x: npc.x, y: npc.y, state: "idle" as const };
  }

  // idle — check if ready to start spinning
  const canStartSpin =
    ai.spinStart === 0 ||
    (ai.spinRestStart !== 0 && now - ai.spinRestStart >= SPIN_REST_DURATION);

  if (canStartSpin && ai.spinState === "idle") {
    ai.spinState = "spinning";
    ai.spinStart = now;
    ai.lastSpinHit = now;
    ai.spinHitCount = 0;
    return { x: npc.x, y: npc.y, state: "startSpin" as const };
  }

  const { x } = chasePlayer(npc, targetX, playerY);
  return { x, y: npc.y };
}
