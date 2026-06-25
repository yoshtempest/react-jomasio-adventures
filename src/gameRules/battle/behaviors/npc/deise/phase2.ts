import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import { createCommonProjectile, createRainProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { DeiseAI } from "./state";
import {
  SPEAR_RAIN_COOLDOWN,
  SPEAR_RAIN_WARNING_DURATION,
  MIN_ACTION_GAP,
  generateSpearPositions,
} from "./state";

type Phase2Result = {
  x: number;
  y: number;
  state?: "pitch" | "walk" | "attack";
};

export function deisePhase2(
  ctx: BehaviorContext,
  ai: DeiseAI,
): Phase2Result {
  const {
    npc, playerX, targetX, targetY,
    projectile, setProjectile,
    lastAttackRef, onMeleeHit,
  } = ctx;

  const now = Date.now();
  const isInPitch = now < ai.phase2PitchEnd;
  const canAct = now - ai.lastAction >= MIN_ACTION_GAP;

  // ── 1. Opening sequence (pitch + initial spear throw) ──
  if (!ai.phase2OpeningDone) {
    if (isInPitch) {
      return { x: npc.x, y: npc.y, state: "pitch" };
    }

    if (!projectile) {
      setProjectile(createCommonProjectile({
        startX: npc.x - 40,
        startY: npc.y + 100,
        targetX: npc.x - 40,
        targetY: 0,
        sprite: "spear",
        state: "idle",
      }));

      ai.lastStaffThrow = now;
      ai.lastAction = now;
      ai.phase2PitchEnd = now;
      ai.phase2OpeningDone = true;
      return { x: npc.x, y: npc.y, state: "pitch" };
    }

    // Opening spear in flight — chase during this period
    const { x } = chasePlayer(npc, targetX, targetY);
    const meleeHit = tryMeleeAttack({
      npcX: npc.x, npcY: npc.y,
      playerX: targetX, playerY: targetY,
      range: 200, cooldown: 2000,
      lastAttackRef, onHit: onMeleeHit,
    });
    if (meleeHit) {
      return { x, y: npc.y, state: "attack" };
    }
    return { x, y: npc.y, state: "walk" };
  }

  // ── 2. Spear rain cycle ──
  if (
    !projectile &&
    canAct &&
    now - ai.lastSpearRain >= SPEAR_RAIN_COOLDOWN
  ) {
    const positions = generateSpearPositions(playerX);
    setProjectile(createRainProjectile({
      warningDuration: SPEAR_RAIN_WARNING_DURATION,
      spearPositions: positions,
    }));
    ai.lastSpearRain = now;
    ai.lastAction = now;
  }

  // ── 3. Movement & melee ──
  if (!projectile || projectile.variant !== "rain") {
    const { x } = chasePlayer(npc, targetX, targetY);
    const meleeHit = tryMeleeAttack({
      npcX: npc.x, npcY: npc.y,
      playerX: targetX, playerY: targetY,
      range: 200, cooldown: 2000,
      lastAttackRef, onHit: onMeleeHit,
    });
    if (meleeHit) {
      return { x, y: npc.y, state: "attack" };
    }
    return { x, y: npc.y, state: "walk" };
  }

  return { x: npc.x, y: npc.y, state: "attack" };
}
