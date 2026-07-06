import { NPC_MELEE_COOLDOWN, NPC_PROJECTILE_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer } from "@/gameRules/npc/movement";
import { isNear } from "@/gameRules/npc/behavior";
import { createCommonProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import { getMauraoState } from "@/gameRules/npc/mauraoState";

import type { BehaviorContext, BehaviorResult } from "@/utils/types/npc/npcBehavior";

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

export function mauraoBehavior(ctx: BehaviorContext): BehaviorResult {
  const now = Date.now();
  const state = getMauraoState(ctx.npc);

  const { npc, playerX, playerY, targetX, onMeleeHit, projectile, setProjectile } = ctx;

  const distanceX = Math.abs(npc.x - targetX);

  // --- THROW ANIMATION SEQUENCE ---

  if (state.throwState === "startThrow") {
    if (now - state.throwStart >= THROW_WIND_UP) {
      setProjectile(createCommonProjectile({
        startX: npc.x - 50,
        startY: npc.y - 100,
        targetX: playerX - 30,
        targetY: playerY - 80,
        sprite: "knife",
        state: "idle",
      }));

      state.throwState = "throwing";
      state.throwStart = now;
    }

    return { x: npc.x, y: npc.y, state: "startThrow" as const };
  }

  if (state.throwState === "throwing") {
    if (now - state.throwStart >= THROW_ACTIVE) {
      state.throwState = "throwed";
      state.throwStart = now;
    }

    return { x: npc.x, y: npc.y, state: "throwing" as const };
  }

  if (state.throwState === "throwed") {
    if (now - state.throwStart >= THROW_FOLLOW_THROUGH) {
      state.throwState = "idle";
    }

    return { x: npc.x, y: npc.y, state: "throwed" as const };
  }

  // --- DASH ANIMATION SEQUENCE ---

  if (state.dashState === "windUp") {
    if (now - state.dashStart >= WIND_UP_DURATION) {
      state.dashState = "dashing";
      state.dashStart = now;
      state.dashStartX = npc.x;
      state.dashTargetX = playerX + (playerX > npc.x ? DASH_EXTRA : -DASH_EXTRA);
      state.dashHitDone = false;
    }

    return { x: npc.x, y: npc.y, state: "startDash" as const };
  }

  if (state.dashState === "dashing") {
    const elapsed = now - state.dashStart;
    const progress = Math.min(elapsed / DASH_DURATION, 1);
    const newX = state.dashStartX + (state.dashTargetX - state.dashStartX) * progress;

    if (!state.dashHitDone && isNear(newX, npc.y, playerX, playerY, MELEE_RANGE)) {
      onMeleeHit();
      state.dashHitDone = true;
    }

    if (progress >= 1) {
      state.dashState = "postDash";
      state.postDashStart = now;
      return { x: newX, y: npc.y, state: "idle" as const };
    }

    return { x: newX, y: npc.y, state: "inDash" as const };
  }

  if (state.dashState === "postDash") {
    if (now - state.postDashStart >= POST_DASH_IDLE) {
      state.dashState = "idle";
    }

    return { x: npc.x, y: npc.y, state: "idle" as const };
  }

  // --- INITIATE ATTACKS ---

  if (distanceX >= THROW_RANGE && !projectile && now - state.lastRangedAttack >= NPC_PROJECTILE_COOLDOWN) {
    state.throwState = "startThrow";
    state.throwStart = now;
    state.lastRangedAttack = now;
    return { x: npc.x, y: npc.y, state: "startThrow" as const };
  }

  if (distanceX <= DASH_RANGE && now - state.lastMeleeAttack >= NPC_MELEE_COOLDOWN) {
    state.dashState = "windUp";
    state.dashStart = now;
    state.lastMeleeAttack = now;
    return { x: npc.x, y: npc.y, state: "startDash" as const };
  }

  // --- DEFAULT: CHASE ---

  const { x } = chasePlayer(npc, targetX, playerY);
  return { x, y: npc.y };
}
