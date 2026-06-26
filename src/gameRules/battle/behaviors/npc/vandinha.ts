import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import { canAttack } from "@/gameRules/npc/behavior";
import { createCommonProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import { tryThrowProjectile } from "@/gameRules/npc/projectile";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

const MELEE_RANGE = 80;
const MELEE_COOLDOWN = 800;
const MELEE_ATTACK_DURATION = 400;
const PROJECTILE_COOLDOWN = 3000;
const SWITCH_DISTANCE = 120;
const IDLE_DURATION = 400;

export function vandinhaBehavior(ctx: BehaviorContext) {
  const {
    npc, targetX, targetY, playerX, playerY,
    projectile, setProjectile, lastAttackRef,
    setForceIdle, onMeleeHit,
  } = ctx;

  const distanceX = Math.abs(npc.x - targetX);
  const now = Date.now();

  if (distanceX <= SWITCH_DISTANCE) {
    if (!npc.ai) npc.ai = {};
    if (!npc.ai.vandinha) {
      npc.ai.vandinha = { lastMeleeAttack: 0 };
    }
    const ai = npc.ai.vandinha;

    const hit = tryMeleeAttack({
      npcX: npc.x,
      npcY: npc.y,
      playerX: targetX,
      playerY: targetY,
      range: MELEE_RANGE,
      cooldown: MELEE_COOLDOWN,
      lastAttackRef,
      onHit: onMeleeHit,
    });

    if (hit) {
      ai.lastMeleeAttack = now;
      return { x: npc.x, y: npc.y, state: "meleeAttack" };
    }

    if (now - ai.lastMeleeAttack < MELEE_ATTACK_DURATION) {
      return { x: npc.x, y: npc.y, state: "meleeAttack" };
    }

    if (!canAttack(lastAttackRef, MELEE_COOLDOWN)) {
      const { x } = chasePlayer(npc, targetX, targetY);
      return { x, y: npc.y, state: "walk" };
    }

    const { x } = chasePlayer(npc, targetX, targetY);
    return { x, y: npc.y };
  }

  tryThrowProjectile({
    projectile,
    cooldown: PROJECTILE_COOLDOWN,
    lastAttackRef,
    setProjectile,
    projectileData: createCommonProjectile({
      startX: npc.x - 100,
      startY: npc.y - 120,
      targetX: playerX,
      targetY: playerY - 120,
      sprite: "dish",
      state: "walk",
    }),
    setForceIdle,
    idleDuration: IDLE_DURATION,
  });

  if (projectile) {
    npc.state = "attack";
    return { x: npc.x, y: npc.y };
  }

  const { x } = chasePlayer(npc, targetX, targetY);
  return { x, y: npc.y };
}
