import { NPC_MELEE_COOLDOWN, NPC_PROJECTILE_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer } from "@/gameRules/npc/movement";
import { isNear } from "@/gameRules/npc/behavior";
import { createCommonProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

import type { MauraoAI } from "./state";
import {
  MELEE_RANGE,
  DASH_RANGE,
  DASH_DURATION,
  DASH_EXTRA,
  WIND_UP_DURATION,
  POST_DASH_IDLE,
  THROW_RANGE,
  THROW_WIND_UP,
  THROW_ACTIVE,
  THROW_FOLLOW_THROUGH,
} from "./state";

export function mauraoPhase1(
  ctx: BehaviorContext,
  ai: MauraoAI,
): BehaviorResult {
  const now = Date.now();
  const {
    npc,
    playerX,
    playerY,
    targetX,
    onMeleeHit,
    projectile,
    setProjectile,
  } = ctx;

  const distanceX = Math.abs(npc.x - targetX);

  // --- THROW ANIMATION SEQUENCE ---

  if (ai.throwState === "startThrow") {
    if (now - ai.throwStart >= THROW_WIND_UP) {
      setProjectile(
        createCommonProjectile({
          startX: npc.x - 50,
          startY: npc.y - 170,
          targetX: playerX - 30,
          targetY: playerY - 120,
          sprite: "knife",
          state: "idle",
        }),
      );

      ai.throwState = "throwing";
      ai.throwStart = now;
    }

    return { x: npc.x, y: npc.y, state: "startThrow" as const };
  }

  if (ai.throwState === "throwing") {
    if (now - ai.throwStart >= THROW_ACTIVE) {
      ai.throwState = "throwed";
      ai.throwStart = now;
    }

    return { x: npc.x, y: npc.y, state: "throwing" as const };
  }

  if (ai.throwState === "throwed") {
    if (now - ai.throwStart >= THROW_FOLLOW_THROUGH) {
      ai.throwState = "idle";
    }

    return { x: npc.x, y: npc.y, state: "throwed" as const };
  }

  // --- DASH ANIMATION SEQUENCE ---

  if (ai.dashState === "windUp") {
    if (now - ai.dashStart >= WIND_UP_DURATION) {
      ai.dashState = "dashing";
      ai.dashStart = now;
      ai.dashStartX = npc.x;
      ai.dashTargetX = playerX + (playerX > npc.x ? DASH_EXTRA : -DASH_EXTRA);
      ai.dashHitDone = false;
    }

    return { x: npc.x, y: npc.y, state: "startDash" as const };
  }

  if (ai.dashState === "dashing") {
    const elapsed = now - ai.dashStart;
    const progress = Math.min(elapsed / DASH_DURATION, 1);
    const newX = ai.dashStartX + (ai.dashTargetX - ai.dashStartX) * progress;

    if (!ai.dashHitDone && isNear(newX, npc.y, playerX, playerY, MELEE_RANGE)) {
      ctx.playSound?.("knifeAttack");
      onMeleeHit();
      ai.dashHitDone = true;
    }

    if (progress >= 1) {
      ai.dashState = "postDash";
      ai.postDashStart = now;
      return { x: newX, y: npc.y, state: "idle" as const };
    }

    return { x: newX, y: npc.y, state: "inDash" as const };
  }

  if (ai.dashState === "postDash") {
    if (now - ai.postDashStart >= POST_DASH_IDLE) {
      ai.dashState = "idle";
    }

    return { x: npc.x, y: npc.y, state: "idle" as const };
  }

  // --- INITIATE ATTACKS ---

  if (
    distanceX >= THROW_RANGE &&
    !projectile &&
    now - ai.lastRangedAttack >= NPC_PROJECTILE_COOLDOWN
  ) {
    ai.throwState = "startThrow";
    ai.throwStart = now;
    ai.lastRangedAttack = now;
    return { x: npc.x, y: npc.y, state: "startThrow" as const };
  }

  if (
    distanceX <= DASH_RANGE &&
    now - ai.lastMeleeAttack >= NPC_MELEE_COOLDOWN
  ) {
    ai.dashState = "windUp";
    ai.dashStart = now;
    ai.lastMeleeAttack = now;
    return { x: npc.x, y: npc.y, state: "startDash" as const };
  }

  // --- DEFAULT: CHASE ---

  const { x } = chasePlayer(npc, targetX, playerY, 1, DASH_RANGE);
  return { x, y: npc.y };
}
