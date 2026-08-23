import { chasePlayer } from "@/gameRules/npc/movement";
import { getDistance } from "@/gameRules/npc/behavior";

import {
  JUMP_CENTER_RADIUS,
  JUMP_EDGE_RADIUS,
  JUMP_EDGE_DAMAGE_MULTIPLIER,
  JUMP_GROUND_Y,
  playBoom,
} from "./state";

import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import { getSlimitaState } from "@/gameRules/npc/slimitaState";

export function handlePhase2(
  ctx: BehaviorContext,
  state: ReturnType<typeof getSlimitaState>,
  now: number,
): BehaviorResult {
  const { npc, playerX, playerY, targetX, targetY, onMeleeHit } = ctx;

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

      const height = Math.sin(progress * Math.PI) * 400;

      const newY = JUMP_GROUND_Y - height;

      const newX = npc.x + (state.targetX - npc.x) * 0.05;

      if (elapsed >= duration) {
        playBoom();
        state.state = "resting";
        state.startTime = now;
        npc.jumpLandingX = undefined;

        const dist = getDistance(state.targetX, JUMP_GROUND_Y, playerX, playerY);
        if (dist <= JUMP_CENTER_RADIUS) {
          onMeleeHit();
        } else if (dist <= JUMP_EDGE_RADIUS) {
          onMeleeHit(JUMP_EDGE_DAMAGE_MULTIPLIER);
        }

        return {
          x: state.targetX,
          y: JUMP_GROUND_Y,
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
