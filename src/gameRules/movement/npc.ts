export function getChaseMovement(
  npcX: number,
  playerX: number,
  distanceX: number
) {
  if (distanceX > 200) {
    return npcX > playerX ? npcX - 2 : npcX + 2;
  }

  if (distanceX > 10) {
    return npcX > playerX ? npcX - 1 : npcX + 1;
  }

  return npcX;
}