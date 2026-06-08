export function calculatePlayerDamage(
  strength: number,
  playerClass: string | null
) {
  let dmg = 12 + strength;

  if (playerClass === "amostradinho") {
    dmg *= 1.1;
  }

  return Math.round(dmg);
}

export function calculateSpecialDamage(
  intelligence: number,
  playerClass: string | null
) {
  let dmg = 18 + intelligence * 3;

  if (playerClass === "amostradinho") {
    dmg *= 1.1;
  }

  return Math.round(dmg);
}

export function calculateNpcDamage(
  baseDamage: number,
  playerClass: string | null
) {
  if (playerClass === "idiota") {
    return Math.round(baseDamage * 0.8);
  }

  return Math.round(baseDamage);
}