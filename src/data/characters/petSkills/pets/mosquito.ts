import { PET_SKILL_COOLDOWN_MS } from "../constants";
import { def } from "../helpers";
import type { PetSkillDefinition } from "../types";

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
