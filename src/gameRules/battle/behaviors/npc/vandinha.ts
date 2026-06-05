import { rangedChaseBehavior } from "@/gameRules/npc/rangedChaseBehavior";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function vandinhaBehavior(
  ctx: BehaviorContext
) {
  return rangedChaseBehavior(ctx, {
    projectileCooldown: 3000,
    idleDuration: 400,

    createProjectile: ({
      npc,
      playerX,
      playerY,
    }) => ({
      x: npc.x,
      y: npc.y,
      targetX: playerX,
      targetY: playerY,
      sprite: "dish",
      createdAt: Date.now(),
      state: "idle",
    }),
  });
}