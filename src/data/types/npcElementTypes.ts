import type { ElementType } from "@/utils/types/battle/element";
import type { CharacterRace } from "@/utils/types/character/race";
import { resolveCharacterElementTypes } from "@/data/characters/races";

/** Pets têm elementos mas não são NPCs de batalha. */
export type PetElementKey = "turkey" | "rapariga" | "zecaUrubu" | "mosquito";

/**
 * Definição de raça de cada NPC.
 *
 * Fonte única de tipagem dos NPCs: `getNpcElementTypes` resolve a herança
 * racial (e tipagens adicionais/mestiças), não uma lista hardcoded. Cada
 * NPC tem `races` (linhagem) e `extraTypes` opcionais.
 *
 * Use `CH`/`Maritime`... abreviações humanas são inválidas — as raças são
 * as mesmas unions dos personagens.
 */
export const NPC_RACES = {
  /* Jomasio */
  hungryDeath: { races: ["Human", "Obscurian"] },
  piupiu: { races: ["Aerial", "Human"] },
  rice: { races: ["Silvan"] },
  jhowsimar: { races: ["Human"] },
  goat: { races: ["Human", "Obscurian"] },
  vandinhaFragment: { races: ["Human", "Psychic"] },
  trueVandinha: { races: ["Obscurian", "Umbrian"] },
  deise: { races: ["Human", "Obscurian"] },
  necromancer: { races: ["Obscurian", "Ignian"] },
  slimita: { races: ["Maritime", "Umbrian"] },
  hungryKing: { races: ["Umbrian", "Obscurian"] },
  denis: { races: ["Ignian", "Human"] },
  srGuaxinim: { races: ["Human", "Psychic"] },
  neimito: { races: ["Ignian", "Psychic"] },
  planetarySisters: { races: ["Human"] },
  manim: { races: ["Psychic", "Human"] },
  maurao: { races: ["Ignian", "Obscurian"] },
  maugrelo: { races: ["Human", "Ignian"] },

  /* Bocaina */
  hungryDog: { races: ["Human"] },
  lupita: { races: ["Ignian", "Obscurian"] },
  duque: { races: ["Ignian", "Luminar"] },
  baiano: { races: ["Human"] },
  spiritMotocycler: { races: ["Umbrian", "Ignian"] },
  tim: { races: ["Obscurian", "Aerial"] },
  muyMacho: { races: ["Human", "Terran"] },

  /* Lagoa grande */
  hungryFish: { races: ["Maritime"] },
  hungryCow: { races: ["Human", "Silvan"] },
  fischer: { races: ["Human", "Maritime"] },
  leviathan: { races: ["Maritime", "Draconian"] },

  /* Cachoeiras */
  figurantOfBaalCult: { races: ["Obscurian"] },
  baal: { races: ["Obscurian", "Ignian"] },
  madame: { races: ["Silvan", "Obscurian"] },

  /* Barragem */
  figurantOfMobyDickCult: { races: ["Maritime", "Psychic"] },
  crocodile: { races: ["Maritime", "Terran"] },
  elitCrocodile: { races: ["Maritime", "Terran"] },
  mobyDick: { races: ["Maritime", "Umbrian"] },
  yangKai: { races: ["Psychic", "Terran"] },

  /* Tanque dos crávos */
  figurantOfDragonKingCult: { races: ["Ignian"] },
  ains: { races: ["Obscurian", "Umbrian"] },
  dragonKing: { races: ["Draconian", "Ignian"] },

  /* Lagoa do Canto */
  hungryPig: { races: ["Human", "Terran"] },
  technoblade: { races: ["Human", "Ferrian"] },

  /* Training */
  dummy: { races: ["Human"] },

  /* Indefinido */
  theStrongestManUnderTheHeavens: { races: ["Human"] },
  theBlackKnight: { races: ["Obscurian"] },
  untrackedMonster: { races: ["Obscurian", "Luminar"] },
  theMasterPiece: { races: ["Ferrian"] },
  theChaosCreator: { races: ["Obscurian"] },
  theFirstNightmare: { races: ["Draconian", "Umbrian"] },
  theDevourerOfWorlds: { races: ["Draconian", "Obscurian"] },

  /* Pets (sem NPC de batalha próprio) */
  turkey: { races: ["Human", "Terran"] },
  rapariga: { races: ["Human", "Luminar"] },
  zecaUrubu: { races: ["Human", "Aerial"] },
  mosquito: { races: ["Aerial", "Silvan"] },
} as const satisfies Partial<Record<NpcType | PetElementKey, CharacterRace>>;

export const NPC_ELEMENT_TYPES: Partial<
  Record<NpcType | PetElementKey, readonly ElementType[]>
> = Object.fromEntries(
  (Object.keys(NPC_RACES) as Array<keyof typeof NPC_RACES>).map((key) => [
    key,
    resolveCharacterElementTypes(NPC_RACES[key]),
  ]),
);

export function getNpcElementTypes(npcType: string): readonly ElementType[] {
  return (
    NPC_ELEMENT_TYPES[npcType as keyof typeof NPC_ELEMENT_TYPES] ?? ["Normalis"]
  );
}
