import { createCommonProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import type {
  BehaviorContext,
  BehaviorResult,
} from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI, GroundPaper } from "./state";
import {
  PHASE2_RISE_DISTANCE,
  PHASE2_RISE_SPEED,
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

export function maugreloPhase2(
  ctx: BehaviorContext,
  ai: MaugreloAI,
): BehaviorResult {
  const { npc } = ctx;
  const now = Date.now();

  if (ai.phase2State === "rising") {
    if (ai.riseStartY === 0) ai.riseStartY = npc.y;

    const risen = ai.riseStartY - npc.y;
    if (risen >= PHASE2_RISE_DISTANCE) {
      ai.phase2State = "orbiting";
      ai.orbitPapers = [];
      distributeOrbitPapers(ai, ORBIT_COUNT);
    } else {
      return {
        x: npc.x,
        y: npc.y - PHASE2_RISE_SPEED,
        state: "flying",
      };
    }
  }

  const orbitingY = ai.riseStartY - PHASE2_RISE_DISTANCE;
  ai.groundPapers = orbitPositions(ai, npc.x, orbitingY);

  handleFirePaper(ai, ctx, npc.x, orbitingY, now);

  return { x: npc.x, y: orbitingY, state: "flying" };
}
