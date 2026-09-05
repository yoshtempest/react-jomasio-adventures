import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "./state";
import {
  updateFlyingPaper,
  cleanupExplosions,
  checkGroundPaperHits,
  updateArmedPapers,
  checkPaperAttackHits,
} from "./papers";
import {
  handlePreMove,
  handleAction,
  handlePostAction,
  handleMeditating,
  handleIdle,
} from "./actions";

export function maugreloPhase1(
  ctx: BehaviorContext,
  ai: MaugreloAI,
): BehaviorResult {
  const now = Date.now();
  const {
    npc,
    playerX,
    playerY,
    playerState,
    playerDirection,
    onMeleeHit,
    onPushPlayer,
    onGroundPaperHit,
    onPaperExplode,
    onArmorBuff,
  } = ctx;

  const distanceX = Math.abs(npc.x - playerX);

  updateFlyingPaper(ai);
  cleanupExplosions(ai, now);
  checkGroundPaperHits(ai, playerX, playerY, onGroundPaperHit, now);
  updateArmedPapers(ai, playerX, playerY, onGroundPaperHit, now);
  checkPaperAttackHits(
    ai,
    playerX,
    playerState,
    playerDirection,
    onPaperExplode,
    now,
  );

  if (ai.actionState === "preMove") {
    return handlePreMove(ai, now, npc.x, npc.y, playerX, ctx.playSound);
  }

  if (ai.actionState === "action") {
    return (
      handleAction(
        ai,
        now,
        npc.x,
        npc.y,
        onMeleeHit,
        onPushPlayer,
        ctx.playSound,
      ) ?? { x: npc.x, y: npc.y }
    );
  }

  if (ai.actionState === "postAction") {
    return handlePostAction(ai, now, npc.x, npc.y);
  }

  if (ai.actionState === "meditating") {
    return handleMeditating(ai, now, npc.x, npc.y, distanceX, onArmorBuff);
  }

  if (ai.actionState === "idle") {
    return handleIdle(ai, now, npc.x, npc.y, playerX, playerY, distanceX);
  }

  return { x: npc.x, y: npc.y };
}
