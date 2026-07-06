import { NPC_MELEE_COOLDOWN, NPC_PROJECTILE_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer } from "@/gameRules/npc/movement";
import { isNear } from "@/gameRules/npc/behavior";
import { createCommonProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import { getMauraoState, type MauraoAIState } from "@/gameRules/npc/mauraoState";

import type { NPCBattleState } from "@/utils/types/npc/npc";
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
  SPIN_DURATION,
  SPIN_CYCLE_DURATION,
  SPIN_HIT_INTERVAL,
  SPIN_MELEE_RANGE,
  SPIN_REST_DURATION,
  SPIN_MOVE_SPEED,
  SPIN_CYCLE_START_THRESHOLD,
  SPIN_CYCLE_END_THRESHOLD,
} from "./state";

export function mauraoBehavior(ctx: BehaviorContext): BehaviorResult {
  const now = Date.now();
  const state = getMauraoState(ctx.npc);

  const { npc, playerX, playerY, targetX, onMeleeHit, projectile, setProjectile } = ctx;

  if (ctx.npcPhase === 2) {
    return mauraoPhase2(ctx, state, now);
  }

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

function mauraoPhase2(ctx: BehaviorContext, state: MauraoAIState, now: number): BehaviorResult {
  const { npc, playerX, playerY, targetX, onMeleeHit } = ctx;

  if (state.spinState === "spinning") {
    const elapsed = now - state.spinStart;

    if (elapsed >= SPIN_DURATION) {
      state.spinState = "resting";
      state.spinRestStart = now;
      return { x: npc.x, y: npc.y, state: "finishSpin" as const };
    }

    const dx = targetX - npc.x;
    const step = Math.min(Math.abs(dx), SPIN_MOVE_SPEED);
    const newX = npc.x + Math.sign(dx) * step;

    if (now - state.lastSpinHit >= SPIN_HIT_INTERVAL) {
      state.lastSpinHit = now;
      if (isNear(newX, npc.y, playerX, playerY, SPIN_MELEE_RANGE)) {
        onMeleeHit();
        state.spinHitCount++;
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

  if (state.spinState === "resting") {
    if (now - state.spinRestStart >= SPIN_REST_DURATION) {
      state.spinState = "idle";
    }

    return { x: npc.x, y: npc.y, state: "idle" as const };
  }

  // idle — check if ready to start spinning
  const canStartSpin = state.spinStart === 0 ||
    (state.spinRestStart !== 0 && now - state.spinRestStart >= SPIN_REST_DURATION);

  if (canStartSpin && state.spinState === "idle") {
    state.spinState = "spinning";
    state.spinStart = now;
    state.lastSpinHit = now;
    state.spinHitCount = 0;
    return { x: npc.x, y: npc.y, state: "startSpin" as const };
  }

  const { x } = chasePlayer(npc, targetX, playerY);
  return { x, y: npc.y };
}
