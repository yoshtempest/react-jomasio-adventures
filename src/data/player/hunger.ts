/** Teto de fome: 100 = alimentado. */
export const MAX_HUNGER = 100;

/**
 * Abaixo ou igual a este valor o personagem é considerado com fome (avatar
 * troca a expressão, toast de aviso dispara). Fonte única: HUD e notificações
 * leem a mesma constante.
 */
export const HUNGRY_THRESHOLD = 20;

export const HUNGER_TICK_MS = 30_000; // check every 30s
export const HUNGER_INTERVAL_MS = 60_000; // 1 min

export const DIFFICULTY_HUNGER_RATE: Record<NpcDifficulty, number> = {
  easy: 0,
  medium: -1,
  hard: -2,
  insano: -3,
};

/**
 * Multiplicador de regeneração por fome: vai de 0.5 (fome zerada, metade da
 * regen) a 1.0 (alimentado). Vive aqui, e não no context, porque é regra pura —
 * services, HUD e timers de regen consomem sem precisar de React.
 */
export function getHungerMultiplier(hunger: number): number {
  const clamped = Math.max(0, Math.min(MAX_HUNGER, hunger));
  return 0.5 + clamped / (MAX_HUNGER * 2);
}
