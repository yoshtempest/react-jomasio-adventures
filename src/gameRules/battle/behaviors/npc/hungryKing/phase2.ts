import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { HungryKingAI } from "./state";

const INVOKING_DURATION = 2000;

export function hungryKingPhase2(ctx: BehaviorContext, ai: HungryKingAI) {
  const { npc, playerX, playerY, lastAttackRef, onMeleeHit, onSummon } = ctx;

  if (!ai.hasSummoned) {
    ai.hasSummoned = true;
    onSummon?.("hungryDeath");
    onSummon?.("hungryDeath");
    onSummon?.("hungryDeath");
    ai.summonEndTime = Date.now() + INVOKING_DURATION;
    return { x: npc.x, y: npc.y, state: "pitch" };
  }

  if (Date.now() < ai.summonEndTime) {
    return { x: npc.x, y: npc.y, state: "pitch" };
  }

  const { x } = chasePlayer(npc, playerX, playerY);

  tryMeleeAttack({
    npcX: npc.x,
    npcY: npc.y,
    playerX,
    playerY,
    range: 40,
    cooldown: 800,
    lastAttackRef,
    onHit: onMeleeHit,
  });

  return { x, y: npc.y };
}
