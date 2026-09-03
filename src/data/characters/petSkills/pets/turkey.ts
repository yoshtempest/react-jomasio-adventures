import { PET_SKILL_COOLDOWN_MS } from "../constants";
import { def } from "../helpers";
import type { PetSkillDefinition } from "../types";

export const pet_turkey: PetSkillDefinition = def(
  "pet_turkey",
  "Peru",
  "turkey",
  "montaria",
  {
    name: "Andarilho",
    description: "Corre mais rápido no modo exploração.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  {
    name: "Voo Rasante",
    description: "Montaria não luta em batalha.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  { kind: "damage", multiplier: 1 },
);
