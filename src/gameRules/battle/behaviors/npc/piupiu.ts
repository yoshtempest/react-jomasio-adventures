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
    cooldown: 800,
    lastAttackRef,
    onHit: onMeleeHit,
  });

  const STATE_ATTACK_COOLDOWN = 800;
  if (!canAttack(lastAttackRef, STATE_ATTACK_COOLDOWN)) {
    return { x: npc.x, y: npc.y, state: "idle" };
  }

  return { x, y: npc.y };
}
