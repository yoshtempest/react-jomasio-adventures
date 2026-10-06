/** Teto de sono: 100 = descansado. */
export const MAX_SLEEP = 100;

/**
 * Abaixo ou igual a este valor o personagem é considerado com sono.
 * Espelha o limiar de fome: os dois avisos usam a mesma janela.
 */
export const SLEEPY_THRESHOLD = 20;

export const SLEEP_TICK_MS = 30_000; // check every 30s
export const SLEEP_INTERVAL_MS = 60_000; // 1 min

export const DIFFICULTY_SLEEP_RATE: Record<NpcDifficulty, number> = {
  easy: 0,
  medium: -1,
  hard: -2,
  insano: -3,
};
