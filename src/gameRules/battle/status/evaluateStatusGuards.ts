import {
  isPlayerBlind,
  isPlayerConfused,
  isPlayerFrozen,
  isPlayerParalyzed,
} from "./statusEffects";

/**
 * Status que interferes em um golpe do jogador antes de ele causar dano.
 *
 * - `frozen`/`paralyzed` — o golpe nem sai;
 * - `blind` — o golpe sai e erra ("miss");
 * - `confused` — o golpe sai contra o próprio jogador.
 */
export type StatusGuard = "frozen" | "blind" | "confused" | "ok";

/** Chance de o golpe de um jogador confuso se voltar contra ele. */
const CONFUSE_BACKFIRE_CHANCE = 0.5;

/**
 * Avalia o status que decide o destino de um golpe.
 *
 * `rng` é injetável para deixar a rolagem da confusão testável — em produção
 * passa `Math.random`.
 */
export function evaluateStatusGuards(
  player: Player,
  rng: () => number = Math.random,
): StatusGuard {
  if (isPlayerFrozen(player) || isPlayerParalyzed(player)) return "frozen";
  if (isPlayerBlind(player)) return "blind";
  if (isPlayerConfused(player) && rng() < CONFUSE_BACKFIRE_CHANCE)
    return "confused";
  return "ok";
}
