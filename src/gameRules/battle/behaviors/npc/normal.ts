import { getChaseMovement } from "@/gameRules/movement/npc";
import { canNpcAttack } from "@/gameRules/battle/npcAttack";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";

export function normalBehavior(ctx: BehaviorContext) {
  const {
    npc,
    playerX,
    playerY,
    lastAttackRef,
    onMeleeHit,
  } = ctx;

  const distanceX = Math.abs(npc.x - playerX);
  const distanceY = Math.abs(npc.y - playerY);

  const newX = getChaseMovement(npc.x, playerX, distanceX);

  if (canNpcAttack(distanceX, distanceY, lastAttackRef.current, 800)) {
    onMeleeHit();
    lastAttackRef.current = Date.now();
  }

  return { x: newX };
}