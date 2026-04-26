import type { DirectionBattle } from "@/utils/types/player/player";

export function isFacingTarget(
  playerX: number,
  playerY: number,
  npcX: number,
  npcY: number,
  direction: DirectionBattle
) {
  const dx = npcX - playerX;
  const dy = npcY - playerY;

  switch (direction) {
    case "right":
      return dx > 0 && Math.abs(dy) <= 50;

    case "left":
      return dx < 0 && Math.abs(dy) <= 50;

    case "up":
      return dy < 0 && Math.abs(dx) <= 50;

    case "down":
      return dy > 0 && Math.abs(dx) <= 50;

    default:
      return false;
  }
}