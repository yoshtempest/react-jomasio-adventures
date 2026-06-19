import { getDistance } from "@/gameRules/npc/behavior";
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
      phase2OpeningDone: false,
      phase2PitchEnd: 0,
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
    ai.phase2OpeningDone = false;
  }

  const now = Date.now();
  const distance = getDistance(npc.x, npc.y, playerX, playerY);
  const isPlayerClose = distance <= CLOSE_RANGE;
  const canAct = now - ai.lastAction >= MIN_ACTION_GAP;

  // Fase 2: arremessa lanças continuamente
  if (npcPhase === 2) {
    const isInPitch = now < ai.phase2PitchEnd;

    if (isInPitch) {
      return { x: npc.x, y: npc.y, state: "pitch" };
    }

    if (!projectile) {
      setProjectile({
        x: npc.x - 40,
        y: npc.y + 100,
        startX: npc.x - 40,
        startY: npc.y + 600,
        dirX: 0,
        dirY: -1,
        sprite: "spear",
        createdAt: now,
        state: "idle",
        fallTargetX: playerX,
        spear: { phase: "rising" },
      });

      ai.lastStaffThrow = now;
      ai.lastAction = now;
      ai.phase2OpeningDone = true;
      ai.phase2PitchEnd = now + 200;
      return { x: npc.x, y: npc.y, state: "pitch" };
    }

    return { x: npc.x, y: npc.y };
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
