import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import { tryThrowProjectile } from "@/gameRules/npc/projectile";

import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function deiseBehavior(ctx: BehaviorContext) {
  const {
    npc,
    playerX,
    playerY,
    projectile,
    setProjectile,
    lastAttackRef,
    setForceIdle,
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

  // 🟢 FASE 1

  // melee tem prioridade
  const meleeHit = tryMeleeAttack({
    npcX: npc.x,
    npcY: npc.y,
    playerX,
    playerY,
    range: 20,
    cooldown: 800,
    lastAttackRef,
    onHit: onMeleeHit,
  });

  if (meleeHit) {
    npc.state = "idle";

    return {
      x: npc.x,
      y: npc.y,
    };
  }

  tryThrowProjectile({
    projectile,
    cooldown: 1500,
    lastAttackRef,
    setProjectile,
    projectileData: {
      x: npc.x,
      y: npc.y + 50,
      targetX: playerX,
      targetY: playerY + 10,
      sprite: "goat",
      createdAt: Date.now(),
      state: "walk",
    },
    setForceIdle,
    idleDuration: 1000,
  });

  // 🚫 parado enquanto projétil existe
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