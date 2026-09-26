import type { ProjectileHitDamageFn } from "@/utils/types/battle/projectileHit";

/** Mínimo de um projétil para que o golpe do jogador possa causá-lo dano. */
type StrikeableProjectile = { hp: number; indestructible: boolean };

export type StrikeOpts = {
  /** Estado do golpe em curso — decide se o dano é o do básico ou do special. */
  playerState: PlayerState;
  /**
   * Consome o token de "1 instância de dano por golpe" do jogador (o mesmo
   * `playerCooldown` que o `handlePlayerHit` consome contra NPC/summon) e
   * reinicia o cooldown correspondente. Devolve false quando o golpe do frame já
   * foi usado.
   */
  claimToken?: (playerState: PlayerState) => boolean;
  /**
   * Dano real do golpe ativo, resolvido pelo mesmo pipeline de
   * `playerHit`/`specialHit`. `null` = o golpe não causa dano agora (special sem
   * carga, jogador congelado, etc).
   */
  resolveHit?: ProjectileHitDamageFn;
  spawnDamage?: (
    damage: number,
    x: number,
    y: number,
    type: DamageType,
  ) => void;
  /** Ponto onde o damage number aparece (centro visual do projétil). */
  point: { x: number; y: number };
  onDestroyed?: () => void;
};

export type StrikeResult<T> =
  | { hit: false }
  | { hit: true; projectile: T | null };

const NO_HIT = { hit: false } as const;

/**
 * Aplica o golpe ativo do jogador (básico **ou special**) num projétil
 * destrutível: gasta o token de 1 instância por golpe, mostra o damage number
 * com o dano real e subtrai esse mesmo dano do HP, destruindo ao zerar.
 *
 * `hit: false` = nada aconteceu (token gasto, golpe sem dano, indestrutível) e
 * o projétil deve seguir o trajeto normal.
 */
export function applyPlayerStrike<T extends StrikeableProjectile>(
  p: T,
  opts: StrikeOpts,
): StrikeResult<T> {
  if (p.indestructible) return NO_HIT;

  const resolved = opts.resolveHit?.(opts.playerState) ?? null;
  if (!resolved || resolved.damage <= 0) return NO_HIT;
  if (opts.claimToken && !opts.claimToken(opts.playerState)) return NO_HIT;

  const { damage, type } = resolved;
  opts.spawnDamage?.(damage, opts.point.x, opts.point.y, type);

  const hp = p.hp - damage;
  if (hp <= 0) {
    opts.onDestroyed?.();
    return { hit: true, projectile: null };
  }
  return { hit: true, projectile: { ...p, hp } };
}
