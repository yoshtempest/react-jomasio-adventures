import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import { rangedChaseBehavior } from "@/gameRules/npc/rangedChaseBehavior";

import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function deiseBehavior(ctx: BehaviorContext) {
  const {
    npc,
    playerX,
    playerY,
    lastAttackRef,
    npcPhase,
    onMeleeHit,
  } = ctx;

  // 🔥 FASE 2 → melee agressivo
  if (npcPhase === 2) {
    const { x } = chasePlayer(
      npc,
      playerX,
      playerY
    );

    tryMeleeAttack({
      npcX: npc.x,
      npcY: npc.y,
      playerX,
      playerY,
      range: 80,
      cooldown: 500,
      lastAttackRef,
      onHit: onMeleeHit,
    });

    return { x, y: npc.y };
  }

  if (npcPhase === 1) {
    return rangedChaseBehavior(ctx, {
      projectileCooldown: 1500,
      idleDuration: 1000,

      melee: {
        range: 20,
        cooldown: 800,
      },

      createProjectile: ({
        npc,
        playerX,
        playerY,
      }) => ({
        x: npc.x,
        y: npc.y + 50,
        targetX: playerX,
        targetY: playerY + 10,
        sprite: "goat",
        createdAt: Date.now(),
        state: "walk",
      }),
    });
  }
}