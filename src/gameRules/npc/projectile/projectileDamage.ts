/** Largura do sprite por variant — usada para centralizar o damage number. */
const DAMAGE_ANCHOR_WIDTH: Record<Projectile["variant"], number> = {
  common: 100,
  pull: 100,
  cut: 100,
  rain: 100,
  burst: 250,
};

/** Altura em que as lanças da chuva atingem o chão (âncora visual da nuvem). */
const RAIN_IMPACT_Y = 550;

export type DamageableProjectile =
  | ProjectileCommon
  | ProjectilePull
  | ProjectileBurst;

/**
 * Centro visual do projétil: onde o damage number aparece e onde a Killer Queen
 * posiciona a bomba. A chuva usa o centro da dispersão de lanças na linha de
 * impacto (o sprite da nuvem fica no topo do mapa).
 */
export function getProjectileCenter(p: Projectile): { x: number; y: number } {
  if (p.variant === "rain") {
    if (p.spears.length === 0) return { x: p.x, y: RAIN_IMPACT_Y };
    const xs = p.spears.map((s) => s.x);
    const min = Math.min(...xs);
    const max = Math.max(...xs);
    return { x: (min + max) / 2, y: RAIN_IMPACT_Y };
  }
  return { x: p.x + DAMAGE_ANCHOR_WIDTH[p.variant] / 2, y: p.y };
}

/**
 * Ponto onde o damage number de um projétil deve aparecer: centralizado
 * horizontalmente sobre o sprite (projéteis usam âncora top-left).
 */
export function getProjectileDamagePoint(
  p: DamageableProjectile,
): { x: number; y: number } {
  return getProjectileCenter(p);
}
