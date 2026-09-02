// PlayerState vem do escopo global (src/utils/types/global.d.ts) — fonte única.
import {
  ONE_HUNDRED_MS,
  ONE_HUNDRED_FIFTY_MS,
  TWO_HUNDRED_MS,
  THREE_HUNDRED_MS,
  FOUR_HUNDRED_MS,
  FIVE_HUNDRED_MS,
  EIGHT_HUNDRED_MS,
} from "@/data/ms";

type AnimationStep = {
  next: PlayerState;
  duration: number; // ms
};

export const animationFlow: Record<PlayerState, AnimationStep | null> = {
  idle: null,

  crit: { next: "idle", duration: THREE_HUNDRED_MS },

  preAttack: { next: "attack", duration: ONE_HUNDRED_FIFTY_MS },
  attack: { next: "idle", duration: THREE_HUNDRED_MS },
  preKick: { next: "kick", duration: ONE_HUNDRED_MS },
  kick: { next: "idle", duration: THREE_HUNDRED_MS },

  preWalk: { next: "walk", duration: ONE_HUNDRED_MS },
  walk: { next: "preRun", duration: TWO_HUNDRED_MS },

  preRun: { next: "run", duration: ONE_HUNDRED_FIFTY_MS },
  run: null, // contínuo

  preJump: null,
  jump: null,
  falling: null, // controlado pela gravidade
  fallingAttack: { next: "falling", duration: TWO_HUNDRED_MS },
  preSpecialInAir: { next: "specialInAir", duration: ONE_HUNDRED_MS },
  specialInAir: { next: "specialInAirFinish", duration: TWO_HUNDRED_MS },
  specialInAirFinish: { next: "idle", duration: ONE_HUNDRED_FIFTY_MS },

  preSpecial: { next: "special", duration: TWO_HUNDRED_MS },
  preSpecial2: { next: "idle", duration: 0 },
  special: { next: "idle", duration: FIVE_HUNDRED_MS },

  dash: { next: "idle", duration: THREE_HUNDRED_MS },

  charging: { next: "idle", duration: FIVE_HUNDRED_MS },

  blocked: null,
  blockAttack: { next: "idle", duration: THREE_HUNDRED_MS },

  stun: { next: "idle", duration: FIVE_HUNDRED_MS },

  idleCrounched: null,
  walkCrounched: null,

  fallen: null,
};

type SpecialFlowOverride = {
  preSpecial: { next: PlayerState; duration: number };
  preSpecial2: { next: PlayerState; duration: number };
  // Opcional: como `special` normalmente avança sozinho para `idle`, o artur
  // o segura (duração gigante) durante toda a coreografia da Killer Queen.
  // O hook `useArturKillerQueen` força `idle` quando a sequência termina.
  special?: { next: PlayerState; duration: number };
};

export const CHARACTER_SPECIAL_FLOWS: Partial<
  Record<CharacterId, SpecialFlowOverride>
> = {
  riquelme: {
    preSpecial: { next: "preSpecial2", duration: FOUR_HUNDRED_MS },
    preSpecial2: { next: "special", duration: EIGHT_HUNDRED_MS },
  },
  artur: {
    preSpecial: { next: "preSpecial2", duration: FOUR_HUNDRED_MS },
    preSpecial2: { next: "special", duration: FIVE_HUNDRED_MS },
    special: { next: "idle", duration: 999_999_999 },
  },
};

export function getSpecialFlowOverride(
  characterId: CharacterId,
): SpecialFlowOverride | null {
  return CHARACTER_SPECIAL_FLOWS[characterId] ?? null;
}
