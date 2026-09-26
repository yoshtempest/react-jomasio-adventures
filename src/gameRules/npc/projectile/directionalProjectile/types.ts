export type CommonParams = {
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

export type PullParams = CommonParams & {
  pullTargetX: number;
};

export type RainParams = {
  x?: number;
  y?: number;
  sprite?: string;
  warningDuration: number;
  spearPositions: number[];
  hp?: number;
  maxHp?: number;
  indestructible?: boolean;
};