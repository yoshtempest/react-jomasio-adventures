import { PET_CLASS } from "@/data/characters/petProgress";

export const PET_XP_BASE: Record<NPCClass, number> = {
  common: 10,
  rare: 25,
  epic: 50,
  boss: 75,
  legendary: 100,
};

export function getPetXPToNextLevel(level: number, petClass: NPCClass): number {
  return level * PET_XP_BASE[petClass];
}

export function getPetClass(petId: string): NPCClass {
  return PET_CLASS[petId] ?? "common";
}
