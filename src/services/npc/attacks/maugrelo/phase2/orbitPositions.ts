import type { MaugreloAI, GroundPaper } from "../state";
import {
  ORBIT_RADIUS,
  ORBIT_Y_OFFSET,
} from "../state";

export function orbitPositions(ai: MaugreloAI, npcX: number, npcY: number): GroundPaper[] {
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