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
  hungryDog: { type: "hungryDog", class: "common" },
  lupita: { type: "lupita", class: "boss" },
  riquelsonDog: { type: "riquelsonDog", class: "epic" },
  baiano: { type: "baiano", class: "epic" },
  spiritMotocycler: { type: "spiritMotocycler", class: "boss" }, /* Juan Derson */
  tim: { type: "tim", class: "boss" }, /* Assassino que pula e faz acrobacias com as 2 facas de sashimi*/
  muyMacho: { type: "muyMacho", class: "boss" },
  
  /* Lagoa grande */
  hungryFish: { type: "hungryFish", class: "common" },
  hungryCow: { type: "hungryCow", class: "common" },
  fischer: { type: "fischer", class: "rare" },
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
  yangKai: { type: "yangKai", class: "legendary" },
  /* Tanque dos crávos */
  figurantOfDragonKingCult: { type: "figurantOfDragonKingCult", class: "common" },
  ains: { type: "ains", class: "boss" }, /* OVERLORD */
  dragonKing: { type: "dragonKing", class: "legendary" },
  /* Lagoa do Canto */
  hungryPigs: { type: "hungryPigs", class: "common" },
  technoblade: { type: "technoblade", class: "legendary" },
};

/*
Personagens que fazem parte do culto de Baal 
  1 - figurantOfBaalCult
  2 - Goat
  3 - SrGuaxinim
  4 - Tim
  5 - baal
*/

/*
Personagens que fazem parte do culto ao rei dragão 
  1 - figurantOfDragonKingCult
  2 - Deise
  3 - Ains
  4 - hungryKing
  5 - dragonKing
*/