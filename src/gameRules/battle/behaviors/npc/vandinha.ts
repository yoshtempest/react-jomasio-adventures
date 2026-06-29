import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import { canAttack } from "@/gameRules/npc/behavior";
import { createCommonProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import { tryThrowProjectile } from "@/gameRules/npc/projectile";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

const MELEE_RANGE = 50;
const MELEE_COOLDOWN = 800;
const MELEE_ATTACK_DURATION = 400;
const PROJECTILE_COOLDOWN = 3000;
const SWITCH_DISTANCE = 120;
const IDLE_DURATION = 100;

export function vandinhaBehavior(ctx: BehaviorContext) {
  const {
    npc, targetX, targetY, playerX, playerY,
    projectile, setProjectile, lastAttackRef,
    setForceIdle, onMeleeHit,
  } = ctx;

  const distanceX = Math.abs(npc.x - targetX);
  const now = Date.now();

  if (!npc.ai) npc.ai = {};
  if (!npc.ai.vandinha) {
    npc.ai.vandinha = { lastMeleeAttack: 0, lastRangedAttack: 0 };
  }
  const ai = npc.ai.vandinha;

  if (distanceX <= SWITCH_DISTANCE) {

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
      return { x: npc.x, y: npc.y, state: "meleeAttack" as const };
    }

    if (now - ai.lastMeleeAttack < MELEE_ATTACK_DURATION) {
      return { x: npc.x, y: npc.y, state: "meleeAttack" as const };
    }

    const inCooldown = !canAttack(lastAttackRef, MELEE_COOLDOWN);

    if (inCooldown) {
      if (distanceX <= MELEE_RANGE) {
        return { x: npc.x, y: npc.y, state: "walk" as const };
      }
      const { x } = chasePlayer(npc, targetX, targetY);
      return { x, y: npc.y, state: "walk" as const };
    }

    if (distanceX <= MELEE_RANGE) {
      return { x: npc.x, y: npc.y };
    }

    const { x } = chasePlayer(npc, targetX, targetY);
    return { x, y: npc.y };
  }

  const threw = tryThrowProjectile({
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

  if (threw) {
    ai.lastRangedAttack = now;
  }

  if (projectile || now - ai.lastRangedAttack < IDLE_DURATION) {
    return { x: npc.x, y: npc.y, state: "rangedAttack" as const };
  }

  const { x } = chasePlayer(npc, targetX, targetY);
  return { x, y: npc.y };
}
