import { createLevels } from "@/utils/professions/createLevel";

/**
 * Níveis de peixe para a profissão Pescador.
 *
 * Cada nível define o peixe "comum" (drop garantido) e a sua "forma rara"
 * (item dropável da profissão, dropado com chance). Os níveis são fixos: um
 * nível por peixe, do nv.0 (Breaded Fish) ao nv.155 (Lunafish) — o nv.120
 * tem DOIS peixes (Fish Bone e Salamander) e não existe peixe de nv.125,
 * exatamente como na tabela da issue.
 *
 * A profissão Pescador precisa estar em nv >= fishLevel para interagir.
 * A cada 5 níveis temos um item dropável da profissão (a forma rara).
 */
export type FishLevel = {
  fishLevel: number;
  commonId: ItemId;
  rareId: ItemId;
  /** XP base fornecido ao pescar este peixe (antes do scaling por nível). */
  xp: number;
  /** Chance de dropar a forma rara (0-1). */
  rareChance: number;
};

export const FISH_LEVELS: FishLevel[] = createLevels("fishLevel", [
  {
    level: 0,
    commonId: "breaded_fish",
    rareId: "reincarnated_breaded_fish",
    rareChance: 0.05,
  },
  {
    level: 5,
    commonId: "bow_meow_fish",
    rareId: "cuddly_bow_meow_fish",
    rareChance: 0.05,
  },
  {
    level: 10,
    commonId: "sturgeon",
    rareId: "golden_sturgeon",
    rareChance: 0.05,
  },
  {
    level: 15,
    commonId: "crabby_anchovy",
    rareId: "difficult_anchovy",
    rareChance: 0.05,
  },
  { level: 20, commonId: "grawn", rareId: "grawnella", rareChance: 0.06 },
  { level: 25, commonId: "loot", rareId: "dull_loote", rareChance: 0.06 },
  {
    level: 30,
    commonId: "hairy_ray",
    rareId: "hairy_ray_volution",
    rareChance: 0.06,
  },
  { level: 35, commonId: "salamon", rareId: "dirty_salamon", rareChance: 0.06 },
  { level: 40, commonId: "moonfish", rareId: "buttfish", rareChance: 0.06 },
  { level: 45, commonId: "perch", rareId: "white_perch", rareChance: 0.07 },
  {
    level: 50,
    commonId: "dragocarp",
    rareId: "cinder_dragocarp",
    rareChance: 0.07,
  },
  {
    level: 55,
    commonId: "maskerel",
    rareId: "flying_maskerel",
    rareChance: 0.07,
  },
  {
    level: 60,
    commonId: "grawfish",
    rareId: "royal_grawfish",
    rareChance: 0.07,
  },
  {
    level: 65,
    commonId: "chehorse",
    rareId: "trumpet_playing_chehorse",
    rareChance: 0.07,
  },
  { level: 70, commonId: "eel", rareId: "meteorite_eel", rareChance: 0.07 },
  {
    level: 75,
    commonId: "scincus",
    rareId: "hermit_scincus",
    rareChance: 0.08,
  },
  {
    level: 80,
    commonId: "hydawhey",
    rareId: "secret_hydawhey",
    rareChance: 0.08,
  },
  {
    level: 85,
    commonId: "piri_pirhiana",
    rareId: "ruffled_pirhiana",
    rareChance: 0.08,
  },
  {
    level: 90,
    commonId: "troutuna",
    rareId: "diminished_troutuna",
    rareChance: 0.08,
  },
  {
    level: 95,
    commonId: "hammer_shark",
    rareId: "hammer_sickle_shark",
    rareChance: 0.08,
  },
  {
    level: 100,
    commonId: "vandame",
    rareId: "jo_chlo_vandam",
    rareChance: 0.09,
  },
  {
    level: 105,
    commonId: "sea_boowolf",
    rareId: "pond_boowolf",
    rareChance: 0.09,
  },
  { level: 110, commonId: "knemo", rareId: "clown_knemo", rareChance: 0.09 },
  {
    level: 115,
    commonId: "dwarf_caiman",
    rareId: "tick_tock_caiman",
    rareChance: 0.09,
  },
  {
    level: 120,
    commonId: "fish_bone",
    rareId: "poisoned_bone",
    rareChance: 0.09,
  },
  {
    level: 120,
    commonId: "salamander",
    rareId: "albino_salamander",
    rareChance: 0.09,
  },
  { level: 130, commonId: "schrymp", rareId: "grawnble", rareChance: 0.1 },
  { level: 135, commonId: "oyster", rareId: "newtral", rareChance: 0.1 },
  { level: 140, commonId: "spitefish", rareId: "anglerfish", rareChance: 0.1 },
  {
    level: 145,
    commonId: "deceptifish",
    rareId: "fabricator",
    rareChance: 0.1,
  },
  {
    level: 150,
    commonId: "sea_boss",
    rareId: "ull_timmit_sea_boss",
    rareChance: 0.1,
  },
  { level: 155, commonId: "lunafish", rareId: "moonafish", rareChance: 0.1 },
]);

/** Nível máximo de peixe existente no jogo (topo da tabela). */
export const MAX_FISH_LEVEL =
  FISH_LEVELS[FISH_LEVELS.length - 1]?.fishLevel ?? 0;

/** Retorna todos os peixes (entradas) de um dado nível de pesca. */
export function getFishesByFishLevel(fishLevel: number): FishLevel[] {
  return FISH_LEVELS.filter((f) => f.fishLevel === fishLevel);
}

/** Nível mínimo de peixe disponível (o mais baixo com drop). */
export function getLowestFishLevel(): number {
  return FISH_LEVELS[0]?.fishLevel ?? 0;
}
