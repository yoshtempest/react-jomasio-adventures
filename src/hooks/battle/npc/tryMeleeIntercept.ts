import { isPlayerInRange } from "@/gameRules/battle/range";
import {
  shouldCutProjectile,
  createSlicedProjectile,
  MARSHADOW_CHARACTER_ID,
} from "@/gameRules/npc/projectileCut";
import type { LinearOpts } from "./handle/handleLinearProjectile";
import { applyMeleeDamage } from "./apply/applyMeleeDamage";


/**
 * Interceptação por ataque do jogador (projéteis common/pull).
 *
 * - Marcelo: a corte passiva desvia o projétil dividindo em 2 — nunca o
 *   destrói. Projéteis indestrutíveis não podem ser cortados.
 * - Demais personagens: o ataque causa dano de HP, destruindo ao zerar.
 *
 * Retorna null (destruído), um projétil cortado, ou undefined (segue sem
 * interceptação).
 */
export function tryMeleeIntercept(
  p: ProjectileCommon | ProjectilePull,
  next: ProjectileCommon | ProjectilePull,
  opts: LinearOpts,
): ProjectileCommon | ProjectilePull | ProjectileCut | null | undefined {
  if (opts.playerState !== "attack") return undefined;
  if (p.indestructible) return undefined;

  const inRange = isPlayerInRange(
    opts.playerX,
    opts.playerY,
    next.x,
    next.y,
    "attack",
    opts.playerCharacter ?? "",
    false,
    false,
    opts.npcClass,
  );
  if (!inRange) return undefined;

  const isMarcelo = opts.playerCharacter === MARSHADOW_CHARACTER_ID;
  if (isMarcelo) {
    const cut = shouldCutProjectile({
      projectile: next,
      playerX: opts.playerX,
      playerY: opts.playerY,
      playerState: opts.playerState,
      playerCharacter: opts.playerCharacter ?? "",
      playerDirection: opts.playerDirection ?? "left",
      npcClass: opts.npcClass,
    });
    if (cut) return createSlicedProjectile(next, next.x, next.y);
    return undefined;
  }

  return applyMeleeDamage(next, opts.onDestroyed);
}
