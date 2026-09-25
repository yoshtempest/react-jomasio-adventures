import { ProjectileHpConstants } from "@/data/projectile";

type CommonParams = {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  sprite?: string;
  state?: "walk" | "idle";
  canCrouchDodge?: boolean;
  landsOnGround?: boolean;
  hp?: number;
  maxHp?: number;
  indestructible?: boolean;
};

type PullParams = CommonParams & {
  pullTargetX: number;
};

type RainParams = {
  x?: number;
  y?: number;
  sprite?: string;
  warningDuration: number;
  spearPositions: number[];
  hp?: number;
  maxHp?: number;
  indestructible?: boolean;
};

export function createCommonProjectile({
  startX,
  startY,
  targetX,
  targetY,
  sprite,
  state = "walk",
  canCrouchDodge = true,
  landsOnGround = false,
  hp = ProjectileHpConstants.DEFAULT_HP,
  maxHp = hp,
  indestructible = false,
}: CommonParams): ProjectileCommon {
  const dx = targetX - startX;
  const dy = targetY - startY;
  const length = Math.hypot(dx, dy) || 1;

  return {
    variant: "common",
    x: startX,
    y: startY,
    startX,
    startY,
    dirX: dx / length,
    dirY: dy / length,
    sprite,
    createdAt: Date.now(),
    state,
    canCrouchDodge,
    landsOnGround,
    hp,
    maxHp,
    indestructible,
  };
}

export function createPullProjectile({
  startX,
  startY,
  targetX,
  targetY,
  sprite,
  state = "walk",
  pullTargetX,
  hp = ProjectileHpConstants.DEFAULT_HP,
  maxHp = hp,
  indestructible = false,
}: PullParams): ProjectilePull {
  const dx = targetX - startX;
  const dy = targetY - startY;
  const length = Math.hypot(dx, dy) || 1;

  return {
    variant: "pull",
    x: startX,
    y: startY,
    startX,
    startY,
    dirX: dx / length,
    dirY: dy / length,
    sprite,
    createdAt: Date.now(),
    state,
    pullTargetX,
    hp,
    maxHp,
    indestructible,
  };
}

export function createRainProjectile({
  x = 0,
  y = -50,
  sprite = "spear",
  warningDuration,
  spearPositions,
  hp = ProjectileHpConstants.DEFAULT_HP,
  maxHp = hp,
  indestructible = false,
}: RainParams): ProjectileRain {
  return {
    variant: "rain",
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
  };
}
