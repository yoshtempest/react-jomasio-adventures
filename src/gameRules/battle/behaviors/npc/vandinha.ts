import { createDirectionalProjectile } from "@/gameRules/npc/createDirectionalProjectile";
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
    }) => createDirectionalProjectile({
      startX: npc.x - 40,
      startY: npc.y - 50,
      targetX: playerX,
      targetY: playerY - 50,
      sprite: "dish",
      state: "walk",
    })
  });
}