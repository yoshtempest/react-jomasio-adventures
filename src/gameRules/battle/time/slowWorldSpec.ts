import { type TimeKind, type TimeSpec, ALL_TIME_KINDS } from ".";

/**
 * Spec de "desacelera o mundo inteiro" — o tick continua rodando, mas movimento
 * e recarga de ataque saem multiplicados. É o caso do O Mais Honrado, em que
 * só o caster e o projétil dele ficam no time normal.
 */
export function slowWorldSpec(
  id: string,
  durationMs: number,
  multipliers: { speed: number; cooldown: number },
  exempt: string[] = [],
  kinds: TimeKind[] = ALL_TIME_KINDS,
): TimeSpec {
  return { id, kinds, exempt, ...multipliers, durationMs };
}