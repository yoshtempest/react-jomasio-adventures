export function calculatePlayerDamage(strength: number, playerClass: string) {
  let dmg = 6 + strength;

  if (playerClass === "amostradinho") {
    dmg *= 1.01;
  }

  return dmg;
}
