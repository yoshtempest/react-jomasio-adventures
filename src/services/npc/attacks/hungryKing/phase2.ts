import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { ProjectileHpConstants } from "@/data/projectile";
import { chasePlayer } from "@/gameRules/npc/movement";
import { nextProjectileId } from "@/gameRules/npc/projectileId";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { HungryKingAI } from "./state";
import {
  BURST_COOLDOWN,
  BURST_MIN_RANGE,
  BURST_WINDUP_MS,
  INVOCATION_MS,
  MELEE_RANGE,
} from "./state";

function createBurstProjectile(
  npcX: number,
  npcY: number,
  direction: "left" | "right",
  createdAt?: number,
): ProjectileBurst {
  const dirX = direction === "right" ? 1 : -1;
  return {
    variant: "burst",
    id: nextProjectileId(),
    // Sai da frente do rei, na altura da boca.
    x: npcX + dirX * 40,
    y: npcY - 60,
    dirX,
    createdAt: createdAt ?? Date.now(),
    sprite: "burst",
    exploded: false,
    hp: ProjectileHpConstants.DEFAULT_HP,
    maxHp: ProjectileHpConstants.DEFAULT_HP,
    indestructible: false,
  };
}

export function hungryKingPhase2(
  ctx: BehaviorContext,
  ai: HungryKingAI,
): { x: number; y: number; state?: NPCBattleState["state"] } {
  const {
    npc,
    targetX,
    targetY,
    lastAttackRef,
    onMeleeHit,
    onSummon,
    projectile,
    setProjectile,
  } = ctx;
  const now = Date.now();

  if (!ai.hasSummoned) {
    ai.hasSummoned = true;
    ai.summonEndTime = now + INVOCATION_MS;
    ctx.playSound?.("summon");
    onSummon?.("hungryDeath");
    onSummon?.("hungryDeath");
    onSummon?.("hungryDeath");
    return { x: npc.x, y: npc.y, state: "pitch" };
  }

  if (now < ai.summonEndTime) {
    return { x: npc.x, y: npc.y, state: "pitch" };
  }

  // ── Windup da burst: segura o sprite attack.svg a distância. ────────────
  if (ai.burstState === "windup") {
    if (now - ai.burstStartTime < BURST_WINDUP_MS) {
      return { x: npc.x, y: npc.y, state: "attack" };
    }
    ai.burstState = "idle";
    ai.lastBurst = now;
    if (!projectile) {
      setProjectile(
        createBurstProjectile(npc.x, npc.y, npc.direction ?? "left"),
      );
      ctx.playSound?.("smash");
    }
    return { x: npc.x, y: npc.y, state: "attack" };
  }

  const distance = Math.hypot(npc.x - targetX, npc.y - targetY);

  // A longa distância o rei troca o dano direto pela burst até a ponta do mapa.
  if (
    distance >= BURST_MIN_RANGE &&
    !projectile &&
    now - ai.lastBurst >= BURST_COOLDOWN
  ) {
    ai.burstState = "windup";
    ai.burstStartTime = now;
    return { x: npc.x, y: npc.y, state: "attack" };
  }

  const { x } = chasePlayer(npc, targetX, targetY, 1, MELEE_RANGE);

  tryMeleeAttack({
    npcX: npc.x,
    npcY: npc.y,
    playerX: targetX,
    playerY: targetY,
    range: MELEE_RANGE,
    cooldown: NPC_MELEE_COOLDOWN,
    lastAttackRef,
    onHit: onMeleeHit,
  });

  return { x, y: npc.y };
}