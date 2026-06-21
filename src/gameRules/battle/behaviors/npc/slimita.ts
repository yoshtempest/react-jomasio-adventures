import { chasePlayer } from "@/gameRules/npc/movement";
import { isNear } from "@/gameRules/npc/behavior";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import { createPullProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import { getSlimitaState } from "@/gameRules/npc/slimitaState";

import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

const PULL_COOLDOWN = 3000;
const FAR_DISTANCE_X = 260;
const MELEE_RANGE = 50;
const MELEE_COOLDOWN = 800;

export function slimitaBehavior(ctx: BehaviorContext) {
  const { npc, playerX, playerY, npcPhase, onMeleeHit, projectile, setProjectile, setForceIdle, lastAttackRef } = ctx;

  const now = Date.now();

  const state = getSlimitaState(npc, playerX);

  // 🟢 FASE 1
  if (npcPhase === 1) {
    const distanceX = Math.abs(npc.x - playerX);

    if (distanceX > FAR_DISTANCE_X) {
      const canPull = !projectile && now - state.lastPullThrow >= PULL_COOLDOWN;

      if (canPull) {
        setProjectile(createPullProjectile({
          startX: npc.x - 40,
          startY: npc.y - 50,
          targetX: playerX,
          targetY: playerY,
          sprite: "staff",
          state: "idle",
          pullTargetX: npc.x - 60,
        }));

        setForceIdle(true);
        setTimeout(() => setForceIdle(false), 400);

        state.lastPullThrow = now;
      }
    }

    tryMeleeAttack({
      npcX: npc.x,
      npcY: npc.y,
      playerX,
      playerY,
      range: MELEE_RANGE,
      cooldown: MELEE_COOLDOWN,
      lastAttackRef,
      onHit: onMeleeHit,
    });

    const { x } = chasePlayer(npc, playerX, playerY);

    return {
      x,
      y: npc.y,
    };
  }

  // 🔥 FASE 2

  switch (state.state) {
    case "idle": {
      const { x, y } = chasePlayer(npc, playerX, playerY);

      state.state = "air";
      state.startTime = now;
      state.targetX = playerX;

      npc.state = "jumping";
      npc.jumpLandingX = playerX;

      return { x, y };
    }

    case "air": {
      npc.state = "jumping";

      const elapsed = now - state.startTime;

      const duration = 2000;

      const progress = Math.min(elapsed / duration, 1);
      const GROUND_Y = 720;

      const height = Math.sin(progress * Math.PI) * 200;

      const newY = GROUND_Y - height;

      const newX = npc.x + (state.targetX - npc.x) * 0.05;

      if (elapsed >= duration) {
        state.state = "resting";
        state.startTime = now;
        npc.jumpLandingX = undefined;

        if (isNear(npc.x, npc.y, playerX, playerY, 140)) {
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
      };
    }

    case "resting": {
      npc.state = "attack";

      const restTime = now - state.startTime;

      if (restTime < 500) {
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
