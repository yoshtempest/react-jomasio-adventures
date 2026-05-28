import type { NPCData } from "@/utils/types/npc/npcProgress";

export const NPCS: Record<string, NPCData> = {
  /* Jomasio */
  hungryDeath: { type: "hungryDeath", class: "common" },
  jhowsimar: { type: "jhowsimar", class: "rare" },
  goat: { type: "goat", class: "rare" },
  vandinhaFragment: { type: "vandinhaFragment", class: "epic" },
  trueVandinha: { type: "trueVanidnha", class: "boss" },
  deise: { type: "deise", class: "boss" },
  slimita: { type: "slimita", class: "boss" },
  elitHungry: { type: "elitHungry", class: "epic" },
  denis: { type: "denis", class: "boss" },
  srGuaxinim: { type: "srGuaxinim", class: "epic" },
  neimito: { type: "neimito", class: "boss" },
  planetarySisters: { type: "planetarySisters", class: "boss" },
  vandinha: { type: "vandinha", class: "boss" },
  manim: { type: "manim", class: "boss" },
  maura: { type: "maura", class: "boss" },

  /* Bocaina */
  lupita: { type: "lupita", class: "boss" },
  riquelsonDog: { type: "riquelsonDog", class: "epic" },
  baiano: { type: "baiano", class: "epic" },
  spiritMotocycler: { type: "spiritMotocycler", class: "boss" },

  /* Lagoa grande */
  monsterOfNessRiver: { type: "monsterOfNessRiver", class: "boss" },
  /* Cachoeiras */
  figurantOfBaalCult: { type: "figurantOfBaalCult", class: "common" },
  baal: { type: "baal", class: "boss" },
  /* Barragem */
  figurantOfLordSeaCult: { type: "figurantOfLordSeaCult", class: "common" },
  crocodile: { type: "crocodile", class: "rare" },
  elitCrocodile: { type: "elitCrocodile", class: "epic" },
  ancestralLordOfSea: { type: "ancestralLordOfSea", class: "boss" },
  /* Tanque dos crávos */
  figurantOfDragonKingCult: { type: "figurantOfDragonKingCult", class: "common" },
  dragonKing: { type: "dragonKing", class: "boss" },
};