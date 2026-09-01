export function getChaseMovement(
  npcX: number,
  npcY: number,
  playerX: number,
  playerY: number,
  speedMultiplier: number = 1,
  stopDistance: number = 10,
) {
  const dx = playerX - npcX;
  const dy = playerY - npcY;

  const distance = Math.hypot(dx, dy);

  if (distance === 0) {
    return { x: npcX, y: npcY };
  }

  let speed = 0;

  if (distance <= stopDistance) speed = 0;
  else if (distance > 200) speed = 2;
  else speed = 1;

  speed *= speedMultiplier;

  const dirX = dx / distance;
  const dirY = dy / distance;

  return {
    x: npcX + dirX * speed,
    y: npcY + dirY * speed,
  };
}
