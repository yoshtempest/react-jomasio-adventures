import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { NPCBattleState } from "@/utils/types/npc/npc";
import type { HungryKingAI } from "./state";

const INVOKING_DURATION = 2000;

export function hungryKingPhase2(
  ctx: BehaviorContext,
  ai: HungryKingAI,
): { x: number; y: number; state?: NPCBattleState["state"] } {
  const { npc, targetX, targetY, lastAttackRef, onMeleeHit, onSummon } = ctx;

  if (!ai.hasSummoned) {
    ai.hasSummoned = true;
    ctx.playSound?.("summon");
    onSummon?.("hungryDeath");
    onSummon?.("hungryDeath");
    onSummon?.("hungryDeath");
    ai.summonEndTime = Date.now() + INVOKING_DURATION;
    return { x: npc.x, y: npc.y, state: "pitch" };
  }

  if (Date.now() < ai.summonEndTime) {
    return { x: npc.x, y: npc.y, state: "pitch" };
  }

  const { x } = chasePlayer(npc, targetX, targetY);

  tryMeleeAttack({
    npcX: npc.x,
    npcY: npc.y,
    playerX: targetX,
    playerY: targetY,
    range: 40,
    cooldown: NPC_MELEE_COOLDOWN,
    lastAttackRef,
    onHit: onMeleeHit,
  });

  return { x, y: npc.y };
}
