import { PET_SKILL_COOLDOWN_MS } from "../constants";
import { def } from "../helpers";
import type { PetSkillDefinition } from "../types";

export const pet_madame: PetSkillDefinition = def(
  "pet_madame",
  "Dona Aranha",
  "madame",
  "suporte",
  {
    name: "Teia Envenenada",
    description: "Ataca com fios de teia.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  {
    name: "Teia Regeneradora",
    description: "Recupera a vida do jogador.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  { kind: "heal", amount: 25 },
);
