// PlayerState vem do escopo global (src/utils/types/global.d.ts) — fonte única.
type AnimationStep = {
  next: PlayerState;
  duration: number; // ms
};

export const animationFlow: Record<PlayerState, AnimationStep | null> = {
  idle: null,

  crit: { next: "idle", duration: 300 },

  preAttack: { next: "attack", duration: 150 },
  attack: { next: "idle", duration: 300 },
  preKick: { next: "kick", duration: 100 },
  kick: { next: "idle", duration: 300 },

  preWalk: { next: "walk", duration: 100 },
  walk: { next: "preRun", duration: 200 },

  preRun: { next: "run", duration: 150 },
  run: null, // contínuo

  preJump: null,
  jump: null,
  falling: null, // controlado pela gravidade
  fallingAttack: { next: "falling", duration: 200 },
  preSpecialInAir: { next: "specialInAir", duration: 100 },
  specialInAir: { next: "specialInAirFinish", duration: 200 },
  specialInAirFinish: { next: "idle", duration: 150 },

  preSpecial: { next: "special", duration: 200 },
  preSpecial2: { next: "idle", duration: 0 },
  special: { next: "idle", duration: 500 },

  dash: { next: "idle", duration: 300 },

  charging: { next: "idle", duration: 500 },

  blocked: null,
  blockAttack: { next: "idle", duration: 300 },

  stun: { next: "idle", duration: 500 },

  idleCrounched: null,
  walkCrounched: null,

  fallen: null,
};

type SpecialFlowOverride = {
  preSpecial: { next: PlayerState; duration: number };
  preSpecial2: { next: PlayerState; duration: number };
};

export const CHARACTER_SPECIAL_FLOWS: Partial<
  Record<CharacterId, SpecialFlowOverride>
> = {
  riquelme: {
    preSpecial: { next: "preSpecial2", duration: 400 },
    preSpecial2: { next: "special", duration: 800 },
  },
};

export function getSpecialFlowOverride(
  characterId: CharacterId,
): SpecialFlowOverride | null {
  return CHARACTER_SPECIAL_FLOWS[characterId] ?? null;
}
