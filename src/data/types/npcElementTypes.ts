import type { ElementType } from "@/utils/types/battle/element";

/** Pets têm elementos mas não são NPCs de batalha. */
type PetElementKey = "turkey" | "rapariga" | "zecaUrubu" | "mosquito";

// `satisfies` garante que toda chave de NPC é um NpcType válido —
// typo aqui quebra a compilação.
export const NPC_ELEMENT_TYPES = {
  /* Jomasio */
  hungryDeath: ["Normalis", "Darkus"],
  piupiu: ["Ventus", "Normalis"],
  rice: ["Natura"],
  jhowsimar: ["Normalis"],
  goat: ["Normalis", "Darkus"],
  vandinhaFragment: ["Normalis", "Psychicus"],
  trueVandinha: ["Darkus", "Umbra"],
  deise: ["Normalis", "Darkus"],
  necromancer: ["Darkus", "Pyrus"],
  slimita: ["Aquos", "Umbra"],
  hungryKing: ["Umbra", "Darkus"],
  denis: ["Pyrus", "Normalis"],
  srGuaxinim: ["Normalis", "Psychicus"],
  neimito: ["Pyrus", "Psychicus"],
  planetarySisters: ["Normalis"],
  manim: ["Psychicus", "Normalis"],
  maurao: ["Pyrus", "Darkus"],
  maugrelo: ["Normalis", "Pyrus"],

  /* Bocaina */
  hungryDog: ["Normalis"],
  lupita: ["Pyrus", "Darkus"],
  duque: ["Pyrus", "Haos"],
  baiano: ["Normalis"],
  spiritMotocycler: ["Umbra", "Pyrus"],
  tim: ["Darkus", "Ventus"],
  muyMacho: ["Normalis", "Subterra"],

  /* Lagoa grande */
  hungryFish: ["Aquos"],
  hungryCow: ["Normalis", "Natura"],
  fischer: ["Normalis", "Aquos"],
  leviathan: ["Aquos", "Draco"],

  /* Cachoeiras */
  figurantOfBaalCult: ["Darkus"],
  baal: ["Darkus", "Pyrus"],
  madame: ["Natura", "Darkus"],

  /* Barragem */
  figurantOfMobyDickCult: ["Aquos", "Psychicus"],
  crocodile: ["Aquos", "Subterra"],
  elitCrocodile: ["Aquos", "Subterra"],
  mobyDick: ["Aquos", "Umbra"],
  yangKai: ["Psychicus", "Subterra"],

  /* Tanque dos crávos */
  figurantOfDragonKingCult: ["Pyrus"],
  ains: ["Darkus", "Umbra"],
  dragonKing: ["Draco", "Pyrus"],

  /* Lagoa do Canto */
  hungryPig: ["Normalis", "Subterra"],
  technoblade: ["Normalis", "Metallum"],

  /* Training */
  dummy: ["Normalis"],

  /* Indefinido */
  theStrongestManUnderTheHeavens: ["Normalis"],
  theBlackKnight: ["Darkus"],
  untrackedMonster: ["Darkus", "Haos"],
  theMasterPiece: ["Metallum"],
  theChaosCreator: ["Darkus"],
  theFirstNightmare: ["Draco", "Umbra"],
  theDevourerOfWorlds: ["Draco", "Darkus"],

  /* Pets (sem NPC de batalha próprio) */
  turkey: ["Normalis", "Subterra"],
  rapariga: ["Normalis", "Haos"],
  zecaUrubu: ["Normalis", "Ventus"],
  mosquito: ["Ventus", "Natura"],
} as const satisfies Partial<
  Record<NpcType | PetElementKey, readonly ElementType[]>
>;

export function getNpcElementTypes(npcType: string): readonly ElementType[] {
  return (
    NPC_ELEMENT_TYPES[npcType as keyof typeof NPC_ELEMENT_TYPES] ?? ["Normalis"]
  );
}
