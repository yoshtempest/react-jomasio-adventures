export function getChaseMovement(
  npcX: number,
  npcY: number,
  playerX: number,
  playerY: number
) {
  const dx = playerX - npcX;
  const dy = playerY - npcY;

  const distance = Math.hypot(dx, dy);

  if (distance === 0) {
    return { x: npcX, y: npcY };
  }

  // velocidade baseada na distância
  let speed = 0;

  if (distance > 200) speed = 2;
  else if (distance > 10) speed = 1;
  else speed = 0;

  // normaliza direção (movimento suave em qualquer ângulo)
  const dirX = dx / distance;
  const dirY = dy / distance;

  return {
    x: npcX + dirX * speed,
    y: npcY + dirY * speed,
  };
}