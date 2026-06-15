import type { Projectile } from "@/utils/types/projectile";

type ThrowProjectileParams = {
  projectile: Projectile | null;
  cooldown: number;
  lastAttackRef: React.RefObject<number>;
  setProjectile: (p: Projectile) => void;
  projectileData: Projectile;
  setForceIdle: (value: boolean) => void;
  idleDuration: number;
};

export function tryThrowProjectile(params: ThrowProjectileParams) {
  const {
    projectile,
    cooldown,
    lastAttackRef,
    setProjectile,
    projectileData,
    setForceIdle,
    idleDuration,
  } = params;

  const now = Date.now();

  if (projectile || now - lastAttackRef.current < cooldown) {
    return false;
  }

  setProjectile(projectileData);

  lastAttackRef.current = now;

  setForceIdle(true);

  setTimeout(() => setForceIdle(false), idleDuration);

  return true;
}
