import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import { tryThrowProjectile } from "@/gameRules/npc/projectile";

import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { DamageKind } from "@/utils/types/battle/damageKind";

type RangedChaseBehaviorOptions = {
  projectileCooldown: number;
  idleDuration: number;

  createProjectile: (ctx: BehaviorContext) => Projectile;

  melee?: {
    range: number;
    cooldown: number;
    /** Natureza do soco: NPCs que atiram magia quase nunca dão melee físico. */
    damageKind?: DamageKind;
  };

  /**
   * Natureza do projétil deste NPC. Fica no comportamento (e não dentro do
   * `createProjectile`) porque é a mesma informação do melee, e o NPC declara
   * uma vez se é uma criatura de magia ou de corpo a corpo.
   */
  projectileDamageKind?: DamageKind;
};

export function rangedChaseBehavior(
  ctx: BehaviorContext,
  options: RangedChaseBehaviorOptions,
) {
  const {
    npc,
    targetX,
    targetY,
    projectile,
    setProjectile,
    lastAttackRef,
    setForceIdle,
    onMeleeHit,
  } = ctx;

  const {
    projectileCooldown,
    idleDuration,
    createProjectile,
    melee,
    projectileDamageKind,
  } = options;

  // melee opcional
  if (melee) {
    const hit = tryMeleeAttack({
      npcX: npc.x,
      npcY: npc.y,
      playerX: targetX,
      playerY: targetY,
      range: melee.range,
      cooldown: melee.cooldown,
      lastAttackRef,
      onHit: onMeleeHit,
      damageKind: melee.damageKind,
    });

    if (hit) {
      npc.state = "attack";

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
    projectileData: {
      ...createProjectile(ctx),
      damageType: projectileDamageKind ?? "physical",
    },
    setForceIdle,
    idleDuration,
  });

  if (projectile) {
    npc.state = "attack";

    return {
      x: npc.x,
      y: npc.y,
    };
  }

  const { x } = chasePlayer(npc, targetX, targetY, 1, melee?.range ?? 10);

  return {
    x,
    y: npc.y,
  };
}
