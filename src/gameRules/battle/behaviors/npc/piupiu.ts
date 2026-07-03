import { NPC_MELEE_COOLDOWN, STATE_ATTACK_COOLDOWN } from "@/data/cooldowns";
import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import { canAttack } from "@/gameRules/npc/behavior";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function piupiuBehavior(ctx: BehaviorContext) {
  const { npc, targetX, targetY, lastAttackRef, onMeleeHit } = ctx;

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
  if (!canAttack(lastAttackRef, STATE_ATTACK_COOLDOWN)) {
    return { x: npc.x, y: npc.y, state: "idle" as const };
  }

  return { x, y: npc.y };
}
