import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import { tryThrowProjectile } from "@/gameRules/npc/projectile";

import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { Projectile } from "@/utils/types/projectile";

type RangedChaseBehaviorOptions = {
  projectileCooldown: number;
  idleDuration: number;

  createProjectile: (ctx: BehaviorContext) => Projectile;

  melee?: {
    range: number;
    cooldown: number;
  };
};

export function rangedChaseBehavior(
  ctx: BehaviorContext,
  options: RangedChaseBehaviorOptions,
) {
  const {
    npc,
    playerX,
    playerY,
    projectile,
    setProjectile,
    lastAttackRef,
    setForceIdle,
    onMeleeHit,
  } = ctx;

  const { projectileCooldown, idleDuration, createProjectile, melee } = options;

  // melee opcional
  if (melee) {
    const hit = tryMeleeAttack({
      npcX: npc.x,
      npcY: npc.y,
      playerX,
      playerY,
      range: melee.range,
      cooldown: melee.cooldown,
      lastAttackRef,
      onHit: onMeleeHit,
    });

    if (hit) {
      npc.state = "idle";

      return {
        x: npc.x,
        y: npc.y,
      };
    }
  }

  tryThrowProjectile({
    projectile,
    cooldown: projectileCooldown,
    lastAttackRef,
    setProjectile,
    projectileData: createProjectile(ctx),
    setForceIdle,
    idleDuration,
  });

  if (projectile) {
    npc.state = "idle";

    return {
      x: npc.x,
      y: npc.y,
    };
  }

  const { x } = chasePlayer(npc, playerX, playerY);

  return {
    x,
    y: npc.y,
  };
}
