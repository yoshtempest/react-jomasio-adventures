import { chasePlayer } from "@/gameRules/npc/movement";
import { tryThrowProjectile } from "@/gameRules/npc/projectile";

import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function vandinhaBehavior(ctx: BehaviorContext) {
  const {
    npc,
    playerX,
    playerY,
    projectile,
    setProjectile,
    lastAttackRef,
    setForceIdle,
  } = ctx;

  tryThrowProjectile({
    projectile,
    cooldown: 3000,
    lastAttackRef,
    setProjectile,
    projectileData: {
      x: npc.x,
      y: npc.y,
      targetX: playerX,
      targetY: playerY,
      sprite: "dish",
      createdAt: Date.now(),
      state: "idle",
    },
    setForceIdle,
    idleDuration: 400,
  });

  // 🚫 não anda enquanto houver projétil ativo
  if (projectile) {
    npc.state = "idle";

    return {
      x: npc.x,
      y: npc.y,
    };
  }

  const { x } = chasePlayer(
    npc,
    playerX,
    playerY
  );

  return {
    x,
    y: npc.y,
  };
}