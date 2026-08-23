import { chasePlayer } from "@/gameRules/npc/movement";
import { isNear } from "@/gameRules/npc/behavior";
import { createPullProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import { NPC_MELEE_COOLDOWN, NPC_PULL_COOLDOWN } from "@/data/cooldowns";

import { FAR_DISTANCE_X, MELEE_RANGE } from "./state";

import { getSlimitaState } from "@/gameRules/npc/slimitaState";

import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";

export function handlePhase1(
  ctx: BehaviorContext,
  state: ReturnType<typeof getSlimitaState>,
  now: number,
): BehaviorResult {
  const {
    npc,
    playerX,
    playerY,
    targetX,
    targetY,
    onMeleeHit,
    projectile,
    setProjectile,
    setForceIdle,
  } = ctx;

  const distanceX = Math.abs(npc.x - targetX);

  if (distanceX > FAR_DISTANCE_X) {
    const canPull =
      !projectile && now - state.lastPullThrow >= NPC_PULL_COOLDOWN;

    if (canPull) {
      setProjectile(
        createPullProjectile({
          startX: npc.x - 40,
          startY: npc.y - 50,
          targetX: playerX,
          targetY: playerY - 80,
          sprite: "staff",
          state: "idle",
          pullTargetX: npc.x,
        }),
      );

      setForceIdle(true);
      setTimeout(() => setForceIdle(false), 400);

      state.lastPullThrow = now;
      state.lastRangedAttack = now;
    }
  }

  const RANGED_ATTACK_DURATION = 400;

  if (projectile || now - state.lastRangedAttack < RANGED_ATTACK_DURATION) {
    const { x } = chasePlayer(npc, targetX, targetY);
    return { x, y: npc.y, state: "rangedAttack" as const };
  }

  const DASH_DURATION = 500;
  const DASH_EXTRA = 100;
  const DASH_RANGE = 50;

  if (state.phase1DashState === "dashing") {
    const elapsed = now - state.phase1DashStart;
    const progress = Math.min(elapsed / DASH_DURATION, 1);
    const newX =
      state.phase1DashStartX +
      (state.phase1DashTargetX - state.phase1DashStartX) * progress;

    if (
      !state.phase1DashHitDone &&
      isNear(newX, npc.y, playerX, playerY, MELEE_RANGE)
    ) {
      onMeleeHit();
      state.phase1DashHitDone = true;
    }

    if (progress >= 1) {
      state.phase1DashState = "idle";
      state.phase1DashHitDone = false;
      state.phase1HopState = "ground";
      state.phase1HopStart = now;
      return { x: newX, y: state.phase1BaseY };
    }

    return { x: newX, y: state.phase1BaseY, state: "meleeAttack" as const };
  }

  if (
    distanceX <= DASH_RANGE &&
    now - state.lastMeleeAttack >= NPC_MELEE_COOLDOWN
  ) {
    state.phase1DashState = "dashing";
    state.phase1DashStart = now;
    state.phase1DashStartX = npc.x;
    state.phase1DashTargetX =
      playerX + (playerX > npc.x ? DASH_EXTRA : -DASH_EXTRA);
    state.phase1DashHitDone = false;
    state.lastMeleeAttack = now;
  }

  const GROUND_DELAY = 150;
  const HOP_DURATION = 400;
  const HOP_HEIGHT = 40;
  const HOP_SPEED = 2;

  if (state.phase1HopState === "ground") {
    if (now - state.phase1HopStart >= GROUND_DELAY) {
      state.phase1HopState = "jumping";
      state.phase1HopStart = now;
      state.phase1HopStartX = npc.x;
    }
    return { x: npc.x, y: state.phase1BaseY, state: "default" as const };
  }

  const hopElapsed = now - state.phase1HopStart;
  const hopProgress = Math.min(hopElapsed / HOP_DURATION, 1);
  const height = Math.sin(hopProgress * Math.PI) * HOP_HEIGHT;
  const hopY = state.phase1BaseY - height;

  const dx = targetX - npc.x;
  const dir = dx > 0 ? 1 : -1;
  const newX = npc.x + dir * HOP_SPEED;

  if (hopElapsed >= HOP_DURATION) {
    state.phase1HopState = "ground";
    state.phase1HopStart = now;
    return { x: newX, y: state.phase1BaseY };
  }

  return { x: newX, y: hopY, state: "walk" as const };
}
