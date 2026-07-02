export type PetProgress = {
  level: number;
  xp: number;
};

export type PetsProgress = Record<string, PetProgress>;

export const PET_DEFAULT_PROGRESS: PetProgress = {
  level: 1,
  xp: 0,
};

export const PET_CLASS: Record<string, NPCClass> = {
  pet_goat: "common",
  pet_cat: "rare",
  pet_dog: "epic",
  pet_fishKing: "legendary",
};

export const PET_BASE_HP = 30;
export const PET_HP_PER_LEVEL = 5;
export const PET_BASE_DAMAGE = 8;
export const PET_DAMAGE_PER_LEVEL = 1;
export const PET_XP_MULTIPLIER = 0.7;
export const PET_MAX_LEVEL = 100;

export function getPetMaxHp(level: number): number {
  return PET_BASE_HP + (level - 1) * PET_HP_PER_LEVEL;
}

export function getPetBaseDamage(level: number): number {
  return PET_BASE_DAMAGE + (level - 1) * PET_DAMAGE_PER_LEVEL;
}

export function normalizePetProgress(data: unknown): PetsProgress {
  const safe: PetsProgress = {};
  const raw = data as Partial<PetsProgress> | undefined;

  for (const petId of Object.keys(PET_CLASS)) {
    const saved = raw?.[petId];
    safe[petId] = {
      level:
        typeof saved?.level === "number" && !Number.isNaN(saved.level)
          ? Math.min(saved.level, PET_MAX_LEVEL)
          : 1,
      xp: typeof saved?.xp === "number" && !Number.isNaN(saved.xp) ? saved.xp : 0,
    };
  }

  return safe;
}
