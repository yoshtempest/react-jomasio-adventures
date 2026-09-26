import { type TimeSpec, ALL_TIME_KINDS } from ".";

/**
 * Spec de "congela o mundo inteiro" — atalho para as habilidades de área
 * (Killer Queen, Expansão de Domínio, O Mais Honrado).
 */
export function freezeWorldSpec(
  id: string,
  durationMs: number,
  exempt: string[] = [],
): TimeSpec {
  return {
    id,
    kinds: ALL_TIME_KINDS,
    exempt,
    speed: 0,
    cooldown: 1,
    durationMs,
  };
}