import type { NPCData } from "@/utils/types/npc/npcProgress";

export const NPCS: Record<string, NPCData> = {
  /* Jomasio */
  hungryDeath: { type: "hungryDeath", class: "common" },
  jhowsimar: { type: "jhowsimar", class: "rare" },
  goat: { type: "goat", class: "rare" },
  vandinhaFragment: { type: "vandinhaFragment", class: "epic" },
  trueVandinha: { type: "trueVanidnha", class: "legendary" },
  deise: { type: "deise", class: "boss" },
  slimita: { type: "slimita", class: "boss" },
  hungryKing: { type: "hungryKing", class: "boss" }, /* culto de Samurion */
  denis: { type: "denis", class: "boss" },
  srGuaxinim: { type: "srGuaxinim", class: "epic" },
  neimito: { type: "neimito", class: "boss" },
  planetarySisters: { type: "planetarySisters", class: "boss" },
  manim: { type: "manim", class: "boss" },
  maura: { type: "maura", class: "boss" },

  /* Bocaina */
  deadDog: { type: "deadDog", class: "common" },
  lupita: { type: "lupita", class: "boss" },
  riquelsonDog: { type: "riquelsonDog", class: "epic" },
  baiano: { type: "baiano", class: "epic" },
  spiritMotocycler: { type: "spiritMotocycler", class: "boss" }, /* Juan Derson */
  tim: { type: "tim", class: "boss" }, /* Assassino que pula e faz acrobacias com as 2 facas de sashimi*/
  muyMacho: { type: "muyMacho", class: "boss" },
  
  /* Lagoa grande */
  deadFish: { type: "deadFish", class: "common" },
  fischer: { type: "deadFish", class: "rare" },
  monsterOfNessRiver: { type: "monsterOfNessRiver", class: "boss" },
  /* Cachoeiras */
  figurantOfBaalCult: { type: "figurantOfBaalCult", class: "common" },
  baal: { type: "baal", class: "legendary" },
  madame: { type: "madame", class: "legendary" }, /* aranha de cão de caça dos baskerville */
  /* Barragem */
  figurantOfMobyDickCult: { type: "figurantOfMobyDickCult", class: "common" },
  crocodile: { type: "crocodile", class: "rare" },
  elitCrocodile: { type: "elitCrocodile", class: "epic" },
  mobyDick: { type: "mobyDick", class: "boss" }, /* baleia */
  /* Tanque dos crávos */
  figurantOfDragonKingCult: { type: "figurantOfDragonKingCult", class: "common" },
  dragonKing: { type: "dragonKing", class: "legendary" },
  /* Lagoa do Canto */
  deadPigs: { type: "pigs", class: "common" },
  technoblade: { type: "technoblade", class: "legendary" },
};