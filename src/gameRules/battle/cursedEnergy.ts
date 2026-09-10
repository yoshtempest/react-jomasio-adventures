/**
 * Regras da energia amaldiçoada do Riquelme.
 *
 * A energia amaldiçoada substitui a mana: não regenera com o tempo, não tem
 * poções e é carregada ao causar dano em inimigos. A conversão em vida é feita
 * pelo botão extra da passiva.
 */
export const CURSED_ENERGY_DAMAGE_RATIO = 5;
export const CURSED_ENERGY_HEAL_RATIO = 5;

export function cursedEnergyFromDamage(damage: number): number {
  return Math.floor(damage / CURSED_ENERGY_DAMAGE_RATIO);
}

export function cursedEnergyHealAmount(energy: number): number {
  return Math.floor(energy / CURSED_ENERGY_HEAL_RATIO);
}