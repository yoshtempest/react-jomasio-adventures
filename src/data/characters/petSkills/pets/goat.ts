import { PET_SKILL_COOLDOWN_MS } from "../constants";
import { def } from "../helpers";
import type { PetSkillDefinition } from "../types";

export const pet_goat: PetSkillDefinition = def(
  "pet_goat",
  "Bodão",
  "goat",
  "dano",
  {
    name: "Cabeçada",
    description: "Ataca com uma cabeçada firme.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  {
    name: "Investida Bruta",
    description: "Pula em direção ao inimigo causando dano triplo.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  { kind: "jumpAttack", multiplier: 3 },
);
