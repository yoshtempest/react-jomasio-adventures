import { createCommonProjectile } from "@/gameRules/npc/createDirectionalProjectile";
import type { BehaviorContext } from "@/utils/types/npc/npcBehavior";
import type { MaugreloAI } from "../state";
import {
  ORBIT_RADIUS,
  ORBIT_Y_OFFSET,
  ORBIT_FIRE_INTERVAL,
} from "../state";

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

  ctx.playSound?.("whooshWind");

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
      canCrouchDodge: false,
      landsOnGround: true,
    }),
  );

  const remaining = ai.orbitPapers;
  remaining.forEach((op, i) => {
    op.angle = (Math.PI * 2 * i) / remaining.length;
  });

  ai.lastPaperFire = now;
}