import { chasePlayer } from "@/gameRules/npc/movement";
import { isNear } from "@/gameRules/npc/behavior";
import { createPullProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import { getSlimitaState } from "@/gameRules/npc/slimitaState";
import { NPC_PULL_COOLDOWN, NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { asset } from "@/utils/asset";

import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

const boomAudio = new Audio(asset("/assets/songs/soundEffects/npc/boom.mp3"));
boomAudio.volume = 0.7;

const FAR_DISTANCE_X = 260;
const MELEE_RANGE = 50;

export function slimitaBehavior(ctx: BehaviorContext) {
  const {
    npc,
    playerX,
    playerY,
    targetX,
    targetY,
    npcPhase,
    onMeleeHit,
    projectile,
    setProjectile,
    setForceIdle,
  } = ctx;

  const now = Date.now();

  const state = getSlimitaState(npc, targetX);

  // 🟢 FASE 1
  if (npcPhase === 1) {
    const distanceX = Math.abs(npc.x - targetX);

    if (distanceX > FAR_DISTANCE_X) {
      const canPull = !projectile && now - state.lastPullThrow >= NPC_PULL_COOLDOWN;

      if (canPull) {
        setProjectile(createPullProjectile({
          startX: npc.x - 40,
          startY: npc.y - 50,
          targetX: playerX,
          targetY: playerY - 80,
          sprite: "staff",
          state: "idle",
          pullTargetX: npc.x,
        }));

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
      const newX = state.phase1DashStartX + (state.phase1DashTargetX - state.phase1DashStartX) * progress;

      if (!state.phase1DashHitDone && isNear(newX, npc.y, playerX, playerY, MELEE_RANGE)) {
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

    if (distanceX <= DASH_RANGE && now - state.lastMeleeAttack >= NPC_MELEE_COOLDOWN) {
      state.phase1DashState = "dashing";
      state.phase1DashStart = now;
      state.phase1DashStartX = npc.x;
      state.phase1DashTargetX = playerX + (playerX > npc.x ? DASH_EXTRA : -DASH_EXTRA);
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

  // 🔥 FASE 2

  const hpRatio = ctx.npcMaxHp ? (ctx.npcHp ?? ctx.npcMaxHp) / ctx.npcMaxHp : 1;
  const jumpDuration = 500 + 1500 * hpRatio;
  const restDuration = 1000;

  switch (state.state) {
    case "idle": {
      ctx.playSound?.("slimitaJump");

      const { x, y } = chasePlayer(npc, targetX, targetY);

      state.state = "air";
      state.startTime = now;
      state.targetX = targetX;

      npc.state = "jumping";
      npc.jumpLandingX = targetX;

      return { x, y, state: "jumping" as const };
    }

    case "air": {
      npc.state = "jumping";

      const elapsed = now - state.startTime;

      const duration = jumpDuration;

      const progress = Math.min(elapsed / duration, 1);
      const GROUND_Y = 720;

      const height = Math.sin(progress * Math.PI) * 200;

      const newY = GROUND_Y - height;

      const newX = npc.x + (state.targetX - npc.x) * 0.05;

      if (elapsed >= duration) {
        boomAudio.currentTime = 0; boomAudio.play().catch(() => {});
        state.state = "resting";
        state.startTime = now;
        npc.jumpLandingX = undefined;

        if (isNear(npc.x, npc.y, targetX, targetY, 140)) {
          onMeleeHit();
        }

        return {
          x: state.targetX,
          y: GROUND_Y,
        };
      }

      return {
        x: newX,
        y: newY,
        state: "jumping" as const,
      };
    }

    case "resting": {
      npc.state = "attack";

      const restTime = now - state.startTime;

      if (restTime < restDuration) {
        return {
          x: npc.x,
          y: npc.y,
        };
      }

      state.state = "idle";
      state.startTime = now;

      return {
        x: npc.x,
        y: npc.y,
      };
    }
  }
}
