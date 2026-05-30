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

  npc.state = "walk";

  const distanceX = Math.abs(npc.x - playerX);
  const distanceY = Math.abs(npc.y - playerY);

  const { x, y } = getChaseMovement(
        npc.x,
        npc.y,
        playerX,
        playerY
  );

  if (canNpcAttack(distanceX, distanceY, lastAttackRef.current, 800)) {
    onMeleeHit();
    lastAttackRef.current = Date.now();
  }

  return { x, y };
}