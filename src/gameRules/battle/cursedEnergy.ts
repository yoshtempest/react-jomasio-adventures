/**
 * Regras da energia amaldiçoada do Riquelme.
 *
 * A energia amaldiçoada substitui a mana: não regenera com o tempo, não tem
 * poções e é carregada ao causar dano em inimigos. A conversão em vida é feita
 * pelo botão extra da passiva.
 */
export const CURSED_ENERGY_DAMAGE_RATIO = 5;
export const CURSED_ENERGY_HEAL_RATIO = 5;

/** Custo do blink (passiva O Abençoado) em energia amaldiçoada. */
export const BLINK_ENERGY_COST = 10;

/** Distância do teleporte curto do blink, em px. */
export const BLINK_DISTANCE = 200;

/**
 * Duração da sequência "O Mais Honrado" (passiva O Abençoado), em ms. Casa com
 * a duração real de honored-one.mp3 (~7.345s): durante esse tempo a batalha
 * congela e o sprite do riquelme fica em mostHonored.svg.
 */
export const HONORED_ONE_DURATION_MS = 7345;

export function cursedEnergyFromDamage(damage: number): number {
  return Math.floor(damage / CURSED_ENERGY_DAMAGE_RATIO);
}

export function cursedEnergyHealAmount(energy: number): number {
  return Math.floor(energy / CURSED_ENERGY_HEAL_RATIO);
}