import { createCommonProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import { BATTLE_LIMITS } from "@/gameRules/movement/constants";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI, GroundPaper } from "./state";
import {
  PHASE2_RISE_DISTANCE,
  PHASE2_RISE_SPEED,
  PHASE2_DESCEND_SPEED,
  PHASE2_LANDING_DURATION,
  PHASE2_PREMOVE_DURATION,
  PHASE2_LASER_DURATION,
  LASER_DAMAGE_INTERVAL,
  LASER_BODY_OFFSET,
  ORBIT_RADIUS,
  ORBIT_Y_OFFSET,
  ORBIT_COUNT,
  ORBIT_FIRE_INTERVAL,
} from "./state";

function distributeOrbitPapers(ai: MaugreloAI, count: number): void {
  ai.orbitPapers = Array.from({ length: count }, (_, i) => ({
    id: ai.paperIdCounter++,
    angle: (Math.PI * 2 * i) / count,
  }));
}

function orbitPositions(ai: MaugreloAI, npcX: number, npcY: number): GroundPaper[] {
  const now = Date.now();
  const centerY = npcY - ORBIT_Y_OFFSET;
  return ai.orbitPapers.map((op) => ({
    id: op.id,
    x: npcX + ORBIT_RADIUS * Math.cos(op.angle) - 20,
    y: centerY + ORBIT_RADIUS * Math.sin(op.angle),
    sprite: "paper" as const,
    createdAt: now,
  }));
}

export function handleFirePaper(
  ai: MaugreloAI,
  ctx: BehaviorContext,
  npcX: number,
  npcY: number,
  now: number,
): void {
  if (ai.orbitPapers.length === 0) return;
  if (now - ai.lastPaperFire < ORBIT_FIRE_INTERVAL) return;

  const idx = Math.floor(Math.random() * ai.orbitPapers.length);

  // Troca o escolhido com o último, para remover sem reindexar.
  const lastIdx = ai.orbitPapers.length - 1;
  const fired = ai.orbitPapers[idx];
  ai.orbitPapers[idx] = ai.orbitPapers[lastIdx]!;
  ai.orbitPapers.pop()!;

  if (!fired) return;

  const firedX = npcX + ORBIT_RADIUS * Math.cos(fired.angle);
  const firedY = npcY - ORBIT_Y_OFFSET + ORBIT_RADIUS * Math.sin(fired.angle);

  ctx.setProjectile(
    createCommonProjectile({
      startX: firedX,
      startY: firedY,
      targetX: ctx.playerX,
      targetY: ctx.playerY,
      sprite: "paper",
      state: "idle",
    }),
  );

  const remaining = ai.orbitPapers;
  remaining.forEach((op, i) => {
    op.angle = (Math.PI * 2 * i) / remaining.length;
  });

  ai.lastPaperFire = now;
}

function isPlayerProtected(playerState: PlayerState): boolean {
  return (
    playerState === "idleCrounched" ||
    playerState === "walkCrounched" ||
    playerState === "blocked" ||
    playerState === "dash" ||
    playerState === "jump" ||
    playerState === "preJump" ||
    playerState === "falling" ||
    playerState === "fallingAttack" ||
    playerState === "specialInAir" ||
    playerState === "preSpecialInAir" ||
    playerState === "specialInAirFinish"
  );
}

function updateLaser(ai: MaugreloAI, ctx: BehaviorContext, now: number): void {
  const { npc, playerX, playerState } = ctx;
  const fromX = npc.x;
  const fromY = ai.riseStartY - LASER_BODY_OFFSET;
  const facingRight = npc.direction === "right";

  const inFront = facingRight ? playerX >= fromX : playerX <= fromX;
  const toX = facingRight
    ? inFront
      ? playerX
      : BATTLE_LIMITS.maxX
    : inFront
      ? playerX
      : BATTLE_LIMITS.minX;

  ai.laser = {
    active: true,
    fromX,
    fromY,
    toX,
    toY: fromY,
    dirX: facingRight ? 1 : -1,
  };

  if (!inFront) return;
  if (isPlayerProtected(playerState)) return;
  if (now - ai.lastLaserDamage < LASER_DAMAGE_INTERVAL) return;

  ai.lastLaserDamage = now;
  ctx.onLaserHit?.();
}

export function maugreloPhase2(
  ctx: BehaviorContext,
  ai: MaugreloAI,
): BehaviorResult {
  const { npc } = ctx;
  const now = Date.now();

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
