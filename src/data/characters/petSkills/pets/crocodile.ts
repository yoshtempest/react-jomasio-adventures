import { PET_SKILL_COOLDOWN_MS } from "../constants";
import { def } from "../helpers";
import type { PetSkillDefinition } from "../types";

export const pet_crocodile: PetSkillDefinition = def(
  "pet_crocodile",
  "Crocodilo da lacoste",
  "crocodile",
  "tanker",
  {
    name: "Escamas Duras",
    description: "Ataca com escamas resistentes.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  {
    name: "Casca Forte",
    description: "Concede um escudo ao jogador.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  { kind: "shield", amount: 20 },
);
