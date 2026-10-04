import { ProjectileHpConstants } from "@/data/projectile";

import { nextProjectileId } from "@/gameRules/npc/projectile/projectileId";
import type { RainParams } from "./types";

export function createRainProjectile({
  x = 0,
  y = -50,
  sprite = "spear",
  warningDuration,
  spearPositions,
  hp = ProjectileHpConstants.DEFAULT_HP,
  maxHp = hp,
  indestructible = false,
  damageType,
}: RainParams): ProjectileRain {
  return {
    variant: "rain",
    id: nextProjectileId(),
    x,
    y,
    startX: x,
    startY: y,
    createdAt: Date.now(),
    warningStartTime: Date.now(),
    warningDuration,
    sprite,
    spears: spearPositions.map((pos) => ({ x: pos, y: -50 })),
    hp,
    maxHp,
    indestructible,
    damageType,
  };
}
