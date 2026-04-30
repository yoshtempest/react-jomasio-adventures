import { CHARACTER_RANGE_X } from "./rangeConfig";

export function isPlayerInRange(
  playerX: number,
  playerY: number,
  npcX: number,
  npcY: number,
  playerState: string,
  character: string
) {
  if (playerState === "jump" || playerState === "blocked") return false;

  const rangeX = CHARACTER_RANGE_X[character];

  const dx = Math.abs(playerX - npcX);
  const dy = Math.abs(playerY - npcY);

  return dx <= rangeX && dy <= 50;
}

export function isNpcInRange(
  playerX: number,
  playerY: number,
  npcX: number,
  npcY: number
) {
  const dx = Math.abs(playerX - npcX);
  const dy = Math.abs(playerY - npcY);

  return dx <= 20 && dy <= 50;
}