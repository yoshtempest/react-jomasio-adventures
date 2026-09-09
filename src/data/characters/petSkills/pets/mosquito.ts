import { PET_SKILL_COOLDOWN_MS } from "@/data/characters/petSkills/constants";
import { def } from "@/data/characters/petSkills/helpers";
import type { PetSkillDefinition } from "@/data/characters/petSkills/types";

export const pet_mosquito: PetSkillDefinition = def(
  "pet_mosquito",
  "Muriçoca Soca Soca",
  "mosquito",
  "dano",
  {
    name: "Picada Zumbidora",
    description: "Ataca com picadas incômodas.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  {
    name: "Enxame Picante",
    description: "Causa dano triplo ao inimigo.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  { kind: "damage", multiplier: 3 },
);
