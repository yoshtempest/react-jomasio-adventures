import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer } from "@/gameRules/npc/movement";
import { isNear } from "@/gameRules/npc/behavior";
import { getMauraoState } from "@/gameRules/npc/mauraoState";

import type { BehaviorContext, BehaviorResult } from "@/utils/types/npc/npcBehavior";

import {
  FAR_DISTANCE_X,
  MELEE_RANGE,
  DASH_RANGE,
  DASH_DURATION,
  DASH_EXTRA,
  WIND_UP_DURATION,
  POST_DASH_IDLE,
} from "./state";

export function mauraoBehavior(ctx: BehaviorContext): BehaviorResult {
  const now = Date.now();
  const state = getMauraoState(ctx.npc);

  const { npc, playerX, playerY, targetX, onMeleeHit } = ctx;

  const distanceX = Math.abs(npc.x - targetX);

  if (distanceX > FAR_DISTANCE_X) {
    const { x } = chasePlayer(npc, targetX, playerY);
    return { x, y: npc.y };
  }

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

  if (distanceX <= DASH_RANGE && now - state.lastMeleeAttack >= NPC_MELEE_COOLDOWN) {
    state.dashState = "windUp";
    state.dashStart = now;
    state.lastMeleeAttack = now;
    return { x: npc.x, y: npc.y, state: "startDash" as const };
  }

  const { x } = chasePlayer(npc, targetX, playerY);
  return { x, y: npc.y };
}
