/**
 * Regras da energia amaldiçoada do Riquelme.
 *
 * A energia amaldiçoada substitui a mana: normalmente não regenera com o tempo,
 * não tem poções e é carregada ao causar dano em inimigos. A conversão em vida
 * é feita pelo botão extra da passiva. Única exceção à regra de regeneração: a
 * passiva O Abençoado recupera 10/s a partir do início da sequência honored-one
 * pelo resto da batalha.
 */
export const CURSED_ENERGY_DAMAGE_RATIO = 5;
export const CURSED_ENERGY_HEAL_RATIO = 5;

/** Custo do blink (passiva O Abençoado) em energia amaldiçoada. */
export const BLINK_ENERGY_COST = 10;

/** Distância do teleporte curto do blink, em px. */
export const BLINK_DISTANCE = 200;

/**
 * Duração da sequência "O Mais Honrado" (passiva O Abençoado), em ms. Casa com
 * a duração real de honored-one.mp3 (~7.345s). É usada como janela de hitstop
 * (congela projéteis e ações) enquanto a coreografia roda; o fim efetivo da
 * sequência acontece quando o riquelme aterrissa em `idleCrounched`.
 */
export const HONORED_ONE_DURATION_MS = 7345;

/** Duração da fase de subida/rotação do "O Mais Honrado", em ms. */
export const HONORED_ONE_RISE_MS = 5_000;

/** Altura que o riquelme sobe no ar durante a fase de subida, em px. */
export const HONORED_ONE_RISE_Y = 400;

/** Distância mínima em x que os inimigos devem manter do jogador durante a sequência. */
export const HONORED_ONE_FLEE_DISTANCE = 300;

/** Passo máximo por tick (20ms) do recuo dos inimigos durante a sequência. */
export const HONORED_ONE_FLEE_STEP = 16;

/**
 * Recuperação passiva de energia amaldiçoada por segundo após o início da
 * sequência "O Mais Honrado" (válida pelo resto da batalha).
 */
export const HONORED_ONE_REGEN_PER_SECOND = 1;

export function cursedEnergyFromDamage(damage: number): number {
  return Math.floor(damage / CURSED_ENERGY_DAMAGE_RATIO);
}

export function cursedEnergyHealAmount(energy: number): number {
  return Math.floor(energy / CURSED_ENERGY_HEAL_RATIO);
}
