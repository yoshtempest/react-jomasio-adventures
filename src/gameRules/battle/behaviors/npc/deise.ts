import { getDistance } from "@/gameRules/npc/behavior";
import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import { createDirectionalProjectile } from "@/gameRules/npc/createDirectionalProjectile";

import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

const STAFF_COOLDOWN = 4000;
const SUMMON_COOLDOWN = 7000;
const MIN_ACTION_GAP = 2000;
const CLOSE_RANGE = 200;

export function deiseBehavior(ctx: BehaviorContext) {
  const {
    npc,
    playerX,
    playerY,
    lastAttackRef,
    npcPhase,
    onMeleeHit,
    onSummon,
    projectile,
    setProjectile,
    setForceIdle,
  } = ctx;

  if (!npc.ai) npc.ai = {};
  if (!npc.ai.deise) {
    const start = Date.now();
    npc.ai.deise = {
      knownPhase: npcPhase,
      lastStaffThrow: start - STAFF_COOLDOWN,
      lastSummon: start,
      lastAction: start - MIN_ACTION_GAP,
    };
  }

  const ai = npc.ai.deise;

  // Se a fase mudou, reseta os cooldowns
  if (npcPhase !== ai.knownPhase) {
    ai.lastStaffThrow = 0;
    ai.lastSummon = 0;
    ai.lastAction = 0;
    ai.knownPhase = npcPhase;
  }

  const now = Date.now();
  const distance = getDistance(npc.x, npc.y, playerX, playerY);
  const isPlayerClose = distance <= CLOSE_RANGE;
  const canAct = now - ai.lastAction >= MIN_ACTION_GAP;

  // Fase 2: só chase + melee, sem summon
  if (npcPhase === 2) {
    const { x, y } = chasePlayer(npc, playerX, playerY);

    tryMeleeAttack({
      npcX: npc.x,
      npcY: npc.y,
      playerX,
      playerY,
      range: 60,
      cooldown: 600,
      lastAttackRef,
      onHit: onMeleeHit,
    });

    return { x, y };
  }

  // Fase 1: alterna com base na distância
  if (npcPhase === 1) {
    if (isPlayerClose) {
      const summonReady = canAct && now - ai.lastSummon >= SUMMON_COOLDOWN;
      if (summonReady) {
        onSummon?.("goat");
        ai.lastSummon = now;
        ai.lastAction = now;
      }
    } else {
      const staffReady = canAct && !projectile && now - ai.lastStaffThrow >= STAFF_COOLDOWN;
      if (staffReady) {
        setProjectile(createDirectionalProjectile({
          startX: npc.x - 40,
          startY: npc.y - 50,
          targetX: playerX,
          targetY: playerY - 50,
          sprite: "staff",
          state: "idle",
        }));

        setForceIdle(true);
        setTimeout(() => setForceIdle(false), 400);

        ai.lastStaffThrow = now;
        ai.lastAction = now;
      }
    }
  }

  tryMeleeAttack({
    npcX: npc.x,
    npcY: npc.y,
    playerX,
    playerY,
    range: 300,
    cooldown: 2000,
    lastAttackRef,
    onHit: onMeleeHit,
  });

  return { x: npc.x, y: npc.y };
}
