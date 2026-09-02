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

export const FISH_LEVELS: FishLevel[] = [
  {
    fishLevel: 0,
    commonId: "breaded_fish",
    rareId: "reincarnated_breaded_fish",
    xp: 10,
    rareChance: 0.05,
  },
  {
    fishLevel: 5,
    commonId: "bow_meow_fish",
    rareId: "cuddly_bow_meow_fish",
    xp: 15,
    rareChance: 0.05,
  },
  {
    fishLevel: 10,
    commonId: "sturgeon",
    rareId: "golden_sturgeon",
    xp: 20,
    rareChance: 0.05,
  },
  {
    fishLevel: 15,
    commonId: "crabby_anchovy",
    rareId: "difficult_anchovy",
    xp: 25,
    rareChance: 0.05,
  },
  {
    fishLevel: 20,
    commonId: "grawn",
    rareId: "grawnella",
    xp: 30,
    rareChance: 0.06,
  },
  {
    fishLevel: 25,
    commonId: "loot",
    rareId: "dull_loote",
    xp: 35,
    rareChance: 0.06,
  },
  {
    fishLevel: 30,
    commonId: "hairy_ray",
    rareId: "hairy_ray_volution",
    xp: 40,
    rareChance: 0.06,
  },
  {
    fishLevel: 35,
    commonId: "salamon",
    rareId: "dirty_salamon",
    xp: 45,
    rareChance: 0.06,
  },
  {
    fishLevel: 40,
    commonId: "moonfish",
    rareId: "buttfish",
    xp: 50,
    rareChance: 0.06,
  },
  {
    fishLevel: 45,
    commonId: "perch",
    rareId: "white_perch",
    xp: 55,
    rareChance: 0.07,
  },
  {
    fishLevel: 50,
    commonId: "dragocarp",
    rareId: "cinder_dragocarp",
    xp: 60,
    rareChance: 0.07,
  },
  {
    fishLevel: 55,
    commonId: "maskerel",
    rareId: "flying_maskerel",
    xp: 65,
    rareChance: 0.07,
  },
  {
    fishLevel: 60,
    commonId: "grawfish",
    rareId: "royal_grawfish",
    xp: 70,
    rareChance: 0.07,
  },
  {
    fishLevel: 65,
    commonId: "chehorse",
    rareId: "trumpet_playing_chehorse",
    xp: 75,
    rareChance: 0.07,
  },
  {
    fishLevel: 70,
    commonId: "eel",
    rareId: "meteorite_eel",
    xp: 80,
    rareChance: 0.07,
  },
  {
    fishLevel: 75,
    commonId: "scincus",
    rareId: "hermit_scincus",
    xp: 85,
    rareChance: 0.08,
  },
  {
    fishLevel: 80,
    commonId: "hydawhey",
    rareId: "secret_hydawhey",
    xp: 90,
    rareChance: 0.08,
  },
  {
    fishLevel: 85,
    commonId: "piri_pirhiana",
    rareId: "ruffled_pirhiana",
    xp: 95,
    rareChance: 0.08,
  },
  {
    fishLevel: 90,
    commonId: "troutuna",
    rareId: "diminished_troutuna",
    xp: 100,
    rareChance: 0.08,
  },
  {
    fishLevel: 95,
    commonId: "hammer_shark",
    rareId: "hammer_sickle_shark",
    xp: 105,
    rareChance: 0.08,
  },
  {
    fishLevel: 100,
    commonId: "vandame",
    rareId: "jo_chlo_vandam",
    xp: 110,
    rareChance: 0.09,
  },
  {
    fishLevel: 105,
    commonId: "sea_boowolf",
    rareId: "pond_boowolf",
    xp: 115,
    rareChance: 0.09,
  },
  {
    fishLevel: 110,
    commonId: "knemo",
    rareId: "clown_knemo",
    xp: 120,
    rareChance: 0.09,
  },
  {
    fishLevel: 115,
    commonId: "dwarf_caiman",
    rareId: "tick_tock_caiman",
    xp: 125,
    rareChance: 0.09,
  },
  {
    fishLevel: 120,
    commonId: "fish_bone",
    rareId: "poisoned_bone",
    xp: 130,
    rareChance: 0.09,
  },
  {
    fishLevel: 120,
    commonId: "salamander",
    rareId: "albino_salamander",
    xp: 130,
    rareChance: 0.09,
  },
  {
    fishLevel: 130,
    commonId: "schrymp",
    rareId: "grawnble",
    xp: 140,
    rareChance: 0.1,
  },
  {
    fishLevel: 135,
    commonId: "oyster",
    rareId: "newtral",
    xp: 145,
    rareChance: 0.1,
  },
  {
    fishLevel: 140,
    commonId: "spitefish",
    rareId: "anglerfish",
    xp: 150,
    rareChance: 0.1,
  },
  {
    fishLevel: 145,
    commonId: "deceptifish",
    rareId: "fabricator",
    xp: 155,
    rareChance: 0.1,
  },
  {
    fishLevel: 150,
    commonId: "sea_boss",
    rareId: "ull_timmit_sea_boss",
    xp: 160,
    rareChance: 0.1,
  },
  {
    fishLevel: 155,
    commonId: "lunafish",
    rareId: "moonafish",
    xp: 165,
    rareChance: 0.1,
  },
] as const satisfies FishLevel[];

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
