type PlayerState =
  | "idle"
  | "walk"
  | "attack"
  | "jump"
  | "dash"
  | "blocked"
  | "stun"
  | "special"
  | "charging"
  | "preAttack"
  | "preWalk"
  | "preJump"
  | "preSpecial"
  | "preRun"
  | "run";

type AnimationStep = {
  next: PlayerState;
  duration: number; // ms
};

export const animationFlow: Record<PlayerState, AnimationStep | null> = {
  idle: null,

  preAttack: { next: "attack", duration: 150 },
  attack: { next: "idle", duration: 300 },

  preWalk: { next: "walk", duration: 100 },
  walk: { next: "preRun", duration: 200 },

  preRun: { next: "run", duration: 150 },
  run: null, // contínuo

  preJump: null,
  jump: null,

  preSpecial: { next: "special", duration: 200 },
  special: { next: "idle", duration: 500 },

  dash: { next: "idle", duration: 300 },

  charging: { next: "idle", duration: 500 },

  blocked: null,

  stun: { next: "idle", duration: 500 },
};
