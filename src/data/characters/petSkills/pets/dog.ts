import { PET_SKILL_COOLDOWN_MS } from "../constants";
import { def } from "../helpers";
import type { PetSkillDefinition } from "../types";

export const pet_dog: PetSkillDefinition = def(
  "pet_dog",
  "Lupita",
  "lupita",
  "dano",
  {
    name: "Mordida Forte",
    description: "Ataca com uma mordida poderosa.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  {
    name: "Mordida Fatal",
    description: "Causa dano triplo ao inimigo.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  { kind: "damage", multiplier: 3 },
);
