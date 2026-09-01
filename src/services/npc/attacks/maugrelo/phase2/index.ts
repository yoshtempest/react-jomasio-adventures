import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "../state";
import {
  PHASE2_RISE_DISTANCE,
  PHASE2_RISE_SPEED,
  PHASE2_DESCEND_SPEED,
  PHASE2_LANDING_DURATION,
  PHASE2_PREMOVE_DURATION,
  PHASE2_LASER_DURATION,
  ORBIT_COUNT,
} from "../state";
import {
  cleanupExplosions,
  checkGroundPaperHits,
  checkPaperAttackHits,
  updateStuckPapers,
} from "../papers";
import { distributeOrbitPapers } from "./distributeOrbitPapers";
import { orbitPositions } from "./orbitPositions";
import { handleFirePaper } from "../actions/handleFirePaper";
import { updateLaser } from "./updateLaser";

export function maugreloPhase2(
  ctx: BehaviorContext,
  ai: MaugreloAI,
): BehaviorResult {
  const { npc } = ctx;
  const now = Date.now();

  cleanupExplosions(ai, now);
  checkGroundPaperHits(
    ai,
    ctx.playerX,
    ctx.playerY,
    ctx.onGroundPaperHit,
    now,
  );
  checkPaperAttackHits(
    ai,
    ctx.playerX,
    ctx.playerState,
    ctx.playerDirection,
    ctx.onPaperExplode,
    now,
  );
  updateStuckPapers(
    ai,
    ctx.playerState,
    ctx.playerX,
    now,
    ctx.onStuckPaperExplode,
  );

  const orbitingY = ai.riseStartY - PHASE2_RISE_DISTANCE;

  if (ai.phase2State === "rising") {
    if (ai.riseStartY === 0) ai.riseStartY = npc.y;

    const risen = ai.riseStartY - npc.y;
    if (risen >= PHASE2_RISE_DISTANCE) {
      ai.phase2State = "orbiting";
      ai.orbitPapers = [];
      distributeOrbitPapers(ai, ORBIT_COUNT);
      ai.phase2StageStart = now;
    } else {
      return {
        x: npc.x,
        y: npc.y - PHASE2_RISE_SPEED,
        state: "flying",
      };
    }
  }

  if (ai.phase2State === "orbiting") {
    ai.groundPapers = orbitPositions(ai, npc.x, orbitingY);

    if (ai.orbitPapers.length === 0) {
      ai.phase2State = "descending";
      ai.phase2StageStart = now;
      ai.groundPapers = [];
    } else {
      handleFirePaper(ai, ctx, npc.x, orbitingY, now);
    }

    return { x: npc.x, y: orbitingY, state: "flying" };
  }

  if (ai.phase2State === "descending") {
    const nextY = npc.y + PHASE2_DESCEND_SPEED;

    if (nextY >= ai.riseStartY) {
      ai.phase2State = "landing";
      ai.phase2StageStart = now;
      return { x: npc.x, y: ai.riseStartY, state: "landing" };
    }

    return { x: npc.x, y: nextY, state: "flying" };
  }

  if (ai.phase2State === "landing") {
    if (now - ai.phase2StageStart >= PHASE2_LANDING_DURATION) {
      ai.phase2State = "preMove";
      ai.phase2StageStart = now;
      return { x: npc.x, y: ai.riseStartY, state: "preMove" };
    }

    return { x: npc.x, y: ai.riseStartY, state: "landing" };
  }

  if (ai.phase2State === "preMove") {
    if (now - ai.phase2StageStart >= PHASE2_PREMOVE_DURATION) {
      ai.phase2State = "laser";
      ai.phase2StageStart = now;
      ctx.playSound?.("laser");
      return { x: npc.x, y: ai.riseStartY, state: "laser" };
    }

    ai.laser = null;
    return { x: npc.x, y: ai.riseStartY, state: "preMove" };
  }

  if (ai.phase2State === "laser") {
    if (now - ai.phase2StageStart >= PHASE2_LASER_DURATION) {
      ai.phase2State = "rising";
      ai.phase2StageStart = now;
      ai.riseStartY = npc.y;
      ai.laser = null;
      return { x: npc.x, y: ai.riseStartY, state: "flying" };
    }

    updateLaser(ai, ctx, now);
    return { x: npc.x, y: ai.riseStartY, state: "laser" };
  }

  ai.laser = null;
  return { x: npc.x, y: ai.riseStartY, state: "laser" };
}
