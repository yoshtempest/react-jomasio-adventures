import {
  type MaugreloAI,
  PAPER_INITIAL_VEL_Y,
  PAPER_X_SPREAD,
  PAPER_VEL_X_SPREAD,
} from "../state";

export function spawnFlyingPaper(
  npcX: number,
  npcY: number,
  playerX: number,
  ai: MaugreloAI,
) {
  const dirX = playerX > npcX ? 1 : -1;
  const xOffset = (Math.random() - 0.5) * PAPER_X_SPREAD;
  const velXOffset = (Math.random() - 0.5) * PAPER_VEL_X_SPREAD;

  ai.flyingPaper = {
    x: npcX + xOffset,
    y: npcY - 80,
    velX: dirX * (2.5 + velXOffset),
    velY: PAPER_INITIAL_VEL_Y,
  };
}
