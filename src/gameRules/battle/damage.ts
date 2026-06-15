export function calculatePlayerDamage(
  strength: number,
  playerClass: string | null,
  baseDamageBonus: number = 0,
) {
  let dmg = 12 + strength + baseDamageBonus;

  if (playerClass === "amostradinho") {
    dmg *= 1.1;
  }

  return Math.round(dmg);
}

export function calculateSpecialDamage(
  intelligence: number,
  playerClass: string | null,
) {
  let dmg = 18 + intelligence * 3;

  if (playerClass === "amostradinho") {
    dmg *= 1.1;
  }

  return Math.round(dmg);
}

export function calculateNpcDamage(
  baseDamage: number,
  playerClass: string | null,
  defense: number = 0,
) {
  let dmg = baseDamage;

  if (defense > 0) {
    dmg *= 100 / (100 + defense);
  }

  if (playerClass === "idiota") {
    dmg *= 0.8;
  }

  return Math.round(dmg);
}

export function calculateDamageToNpc(
  damage: number,
  npcArmor: number = 0,
): number {
  if (npcArmor <= 0) return damage;
  return Math.round((damage * 100) / (100 + npcArmor));
}
