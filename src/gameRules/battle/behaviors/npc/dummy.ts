import { NPC_MELEE_COOLDOWN } from "@/data/cooldowns";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function dummyBehavior(ctx: BehaviorContext) {
  const { npc, targetX, targetY, lastAttackRef, onMeleeHit } = ctx;

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

  return { x: npc.x, y: npc.y, state: "idle" as const };
}
