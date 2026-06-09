import { chasePlayer } from "@/gameRules/npc/movement";
import { tryMeleeAttack } from "@/gameRules/npc/attack";

import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function deiseBehavior(ctx: BehaviorContext) {
  const {
    npc,
    playerX,
    playerY,
    lastAttackRef,
    npcPhase,
    onMeleeHit,
    onSummon,
    summonTimerRef,
  } = ctx;

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

  if (npcPhase === 1) {
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

    const now = Date.now();
    if (
      onSummon &&
      summonTimerRef &&
      (summonTimerRef.current === 0 || now - summonTimerRef.current >= 10000)
    ) {
      summonTimerRef.current = now;
      onSummon("goat");
    }

    return { x: npc.x, y: npc.y };
  }

  return { x: npc.x, y: npc.y };
}
