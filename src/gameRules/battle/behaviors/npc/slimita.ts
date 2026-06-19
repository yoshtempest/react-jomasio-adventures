import { chasePlayer } from "@/gameRules/npc/movement";
import { isNear } from "@/gameRules/npc/behavior";
import { getSlimitaState } from "@/gameRules/npc/slimitaState";

import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function slimitaBehavior(ctx: BehaviorContext) {
  const { npc, playerX, playerY, npcPhase, onMeleeHit } = ctx;

  const now = Date.now();

  const state = getSlimitaState(npc, playerX);

  // 🟢 FASE 1
  if (npcPhase === 1) {
    const { x } = chasePlayer(npc, playerX, playerY);

    if (isNear(npc.x, npc.y, playerX, playerY, 50)) {
      onMeleeHit();
    }

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
