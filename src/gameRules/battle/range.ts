import { CHARACTER_RANGE_X } from "./rangeConfig";

export function isPlayerInRange(
  playerX: number,
  playerY: number,
  npcX: number,
  npcY: number,
  playerState: playerState,
  character: string,
  isSpecial: boolean,
  isBlock = false,
) {
  if (!isBlock && ((!isSpecial && playerState === "jump") || playerState === "blocked")) {
    return false;
  }

  const ranges = CHARACTER_RANGE_X[character];

  if (!ranges) return false;

  const rangeX = isSpecial ? ranges.specialHitRange : isBlock ? ranges.blockHitRange : ranges.normalHitRange;

  const dx = Math.abs(playerX - npcX);
  const dy = Math.abs(playerY - npcY);

  return dx <= rangeX && dy <= 150;
}

export function isNpcInRange(
  playerX: number,
  playerY: number,
  npcX: number,
  npcY: number,
) {
  const dx = Math.abs(playerX - npcX);
  const dy = Math.abs(playerY - npcY);

  return dx <= 50 && dy <= 150;
}
