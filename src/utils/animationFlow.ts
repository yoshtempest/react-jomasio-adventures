type PlayerState =
  | "idle"
  | "walk"
  | "attack"
  | "jump"
  | "dash"
  | "blocked"
  | "special"
  | "preAttack"
  | "preWalk"
  | "preJump"
  | "preSpecial";

type AnimationStep = {
  next: PlayerState;
  duration: number; // ms
};

export const animationFlow: Record<PlayerState, AnimationStep | null> = {
  idle: null,

  preAttack: { next: "attack", duration: 150 },
  attack: { next: "idle", duration: 300 },

  preWalk: { next: "walk", duration: 100 },
  walk: null, // contínuo

  preJump: null,
  jump: null,

  preSpecial: { next: "special", duration: 200 },
  special: { next: "idle", duration: 500 },

  dash: { next: "idle", duration: 300 },

  blocked: null,
};