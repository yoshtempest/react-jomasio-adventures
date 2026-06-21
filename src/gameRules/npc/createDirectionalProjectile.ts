type CommonParams = {
  startX: number;
  startY: number;
  targetX: number;
  targetY: number;
  sprite?: string;
  state?: "walk" | "idle";
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
};

export function createCommonProjectile({
  startX,
  startY,
  targetX,
  targetY,
  sprite,
  state = "walk",
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
  };
}

export function createRainProjectile({
  x = 0,
  y = -50,
  sprite = "spear",
  warningDuration,
  spearPositions,
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
  };
}
