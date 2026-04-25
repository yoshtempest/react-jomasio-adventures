export function calculatePlayerDamage(
  strength: number,
  playerClass: string | null
) {
  let dmg = 6 + strength;

  if (playerClass === "amostradinho") {
    dmg *= 1.01;
  }

  return dmg;
}

export function calculateSpecialDamage(
  intelligence: number,
  playerClass: string | null
) {
  let dmg = 13 + intelligence * 2;

  if (playerClass === "amostradinho") {
    dmg *= 1.01;
  }

  return dmg;
}

export function calculateNpcDamage(
  baseDamage: number,
  playerClass: string | null
) {
  if (playerClass === "idiota") {
    return baseDamage * 0.92;
  }

  return baseDamage;
}