/**
 * Dano que o golpe do jogador aplicou num projétil, resolvido pelo mesmo
 * pipeline de `playerHit`/`specialHit` usado contra NPC e summons.
 */
export type ProjectileHit = {
  damage: number;
  /** Estilo do damage number sobre o projétil. */
  type: DamageType;
};

export type ProjectileHitResolveOptions = {
  /**
   * Ignora o gate de carga do special (delícia). Usado só pelo dano de área da
   * explosão do Killer Queen: o special consumiu a delícia ao abrir a sequência,
   * então a explosão — que é a cauda desse mesmo golpe — não pode reprovar no
   * gate, ou o projétil nunca levaria dano.
   */
  bypassCharge?: boolean;
};

/**
 * Dano do golpe ativo para o estado informado. `null` quando o golpe não causa
 * dano naquele momento (special sem carga, jogador congelado, cego, etc).
 */
export type ProjectileHitDamageFn = (
  playerState: PlayerState,
  options?: ProjectileHitResolveOptions,
) => ProjectileHit | null;

/** Golpe de área já instanciado sobre um projétil específico. */
export type ProjectileStrike = {
  /** `Projectile.id` do alvo. */
  id: string;
  /**
   * Quantas explosões caíram sobre o projétil: o dano de área empilha igual ao
   * dos inimigos (`onAreaDamage` soma as explosões num raio de 200px).
   */
  multiplier: number;
};
