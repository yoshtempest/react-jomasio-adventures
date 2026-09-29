import { BATTLE_LIMITS } from "./constants";

/**
 * Mantém um X dentro dos limites horizontais da arena.
 *
 * Regra usada por todo mundo que empurra, puxa, teleporta ou clona alguém
 * dentro da arena: melee, projéteis, dash, summons, allies, loot, código de cada
 * habilidade. Antes cada call site reescrevia o `Math.max/Math.min` à mão e o
 * limite da arena vivia copiado em 20+ lugares.
 *
 * @param x    coordenada a limitar
 * @param pad  margem interna em px — `pad > 0` encolhe a área útil em que
 *             ambos os lados (usado pelo loot, que não pode encostar na borda).
 */
export function clampX(x: number, pad = 0): number {
  return Math.max(
    BATTLE_LIMITS.minX + pad,
    Math.min(BATTLE_LIMITS.maxX - pad, x),
  );
}
