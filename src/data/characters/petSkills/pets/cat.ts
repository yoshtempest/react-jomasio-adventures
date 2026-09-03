import { PET_SKILL_COOLDOWN_MS } from "../constants";
import { def } from "../helpers";
import type { PetSkillDefinition } from "../types";

export const pet_cat: PetSkillDefinition = def(
  "pet_cat",
  "Rapariga",
  "rapariga",
  "suporte",
  {
    name: "Ronronar",
    description: "Ataca com arranhões rápidos.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  {
    name: "Bola de Pelo",
    description: "Recupera a vida do jogador.",
    cooldownMs: PET_SKILL_COOLDOWN_MS,
  },
  { kind: "heal", amount: 20 },
);
