export function generateNpcLevel(playerLevel: number = 1) {
  const min = Math.max(1, playerLevel - 3);
  const max = playerLevel + 3;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
