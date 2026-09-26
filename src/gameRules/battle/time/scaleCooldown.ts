import { type BattleTime } from ".";

/**
 * Escala um time em ms pelo multiplicador de cooldown da entidade. Concentrar
 * aqui evita que cada consumer aplique o regra de combinação por conta própria.
 */
export function scaleCooldown(time: BattleTime, cooldownMs: number): number {
  return cooldownMs * time.cooldown;
}