import { ProjectileHpConstants } from "@/data/projectile";

export function applyMeleeDamage(
  p: ProjectileCommon | ProjectilePull,
  onDestroyed?: () => void,
): ProjectileCommon | ProjectilePull | null {
  const hp = p.hp - ProjectileHpConstants.PLAYER_MELEE_DAMAGE;
  if (hp <= 0) {
    onDestroyed?.();
    return null;
  }
  return { ...p, hp };
}