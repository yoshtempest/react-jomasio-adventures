import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function normalBehavior(ctx: BehaviorContext) {
  const { npc, playerX, playerY, lastAttackRef, onMeleeHit } = ctx;

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
