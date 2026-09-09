import { createLevels } from "@/utils/professions/createLevel";

/**
 * Níveis de minério para a profissão Mineiro.
 *
 * Cada nível define o minério/recurso "comum" (drop garantido) e a sua
 * "forma rara" (item dropável da profissão, dropado com chance). Os níveis
 * são fixos: um nível por minério, do nv.0 (Iron/Tin Ore) ao nv.155
 * (Fragmonnite) — nv.0 tem DOIS minérios (Iron e Tin).
 *
 * A profissão Mineiro precisa estar em nv >= rockLevel para interagir.
 * A cada 5 níveis temos um item dropável da profissão (a forma rara).
 */
export type OreLevel = {
  rockLevel: number;
  commonId: ItemId;
  rareId: ItemId;
  /** XP base fornecido ao minerar este minério (antes do scaling por nível). */
  xp: number;
  /** Chance de dropar a forma rara (0-1). */
  rareChance: number;
};

export const ORE_LEVELS: OreLevel[] = createLevels("rockLevel", [
  {
    level: 0,
    commonId: "iron_ore",
    rareId: "crystalline_iron_ore",
    rareChance: 0.05,
  },
  { level: 0, commonId: "tin_ore", rareId: "glow_tin_ore", rareChance: 0.05 },
  {
    level: 5,
    commonId: "finest_sea_salt",
    rareId: "verbala_salt",
    rareChance: 0.05,
  },
  {
    level: 10,
    commonId: "classic_carbon",
    rareId: "burning_coal",
    rareChance: 0.05,
  },
  {
    level: 15,
    commonId: "copper_ore",
    rareId: "trombone_ore",
    rareChance: 0.05,
  },
  {
    level: 20,
    commonId: "shadowy_cobalt",
    rareId: "darkness_cobalt",
    rareChance: 0.06,
  },
  {
    level: 25,
    commonId: "bronze_nugget",
    rareId: "consolatory_bronze",
    rareChance: 0.06,
  },
  {
    level: 30,
    commonId: "shard_of_flint",
    rareId: "flammable_flint",
    rareChance: 0.06,
  },
  {
    level: 35,
    commonId: "rugged_quartz",
    rareId: "smoked_quartz",
    rareChance: 0.06,
  },
  {
    level: 40,
    commonId: "grievous_kroomium",
    rareId: "flamboyant_kroomium",
    rareChance: 0.06,
  },
  {
    level: 45,
    commonId: "wholesome_zinc",
    rareId: "shiny_zinc",
    rareChance: 0.07,
  },
  {
    level: 50,
    commonId: "royal_bauxite",
    rareId: "imperial_bauxite",
    rareChance: 0.07,
  },
  {
    level: 55,
    commonId: "blood_red_amethyst",
    rareId: "dragonheart_amethyst",
    rareChance: 0.07,
  },
  { level: 60, commonId: "koral", rareId: "koral_reef", rareChance: 0.07 },
  {
    level: 65,
    commonId: "taroudium_ore",
    rareId: "polished_taroudium",
    rareChance: 0.07,
  },
  {
    level: 70,
    commonId: "hazy_lead_ore",
    rareId: "luminous_lead_ore",
    rareChance: 0.07,
  },
  {
    level: 75,
    commonId: "sandy_ore",
    rareId: "rose_of_the_sands",
    rareChance: 0.08,
  },
  { level: 80, commonId: "black_gold", rareId: "onyx_ore", rareChance: 0.08 },
  {
    level: 85,
    commonId: "mythwil_ore",
    rareId: "sumptuous_mythwil_ore",
    rareChance: 0.08,
  },
  {
    level: 90,
    commonId: "double_carat_sapphire_stone",
    rareId: "dull_sapphire",
    rareChance: 0.08,
  },
  {
    level: 95,
    commonId: "sovereign_titanium",
    rareId: "foreal_titanium",
    rareChance: 0.08,
  },
  {
    level: 100,
    commonId: "sryanide_ore",
    rareId: "acid_sryanure",
    rareChance: 0.09,
  },
  {
    level: 105,
    commonId: "dark_carbon",
    rareId: "carbon_hara",
    rareChance: 0.09,
  },
  {
    level: 110,
    commonId: "amber",
    rareId: "prehistoric_amber",
    rareChance: 0.09,
  },
  {
    level: 115,
    commonId: "mercury",
    rareId: "chrome_plated_mercury",
    rareChance: 0.09,
  },
  {
    level: 120,
    commonId: "silver_ore",
    rareId: "shiny_silver_ore",
    rareChance: 0.09,
  },
  {
    level: 125,
    commonId: "obsidian_ore",
    rareId: "iridescent_obsidian",
    rareChance: 0.1,
  },
  {
    level: 130,
    commonId: "frozen_garnet",
    rareId: "absolute_garnet",
    rareChance: 0.1,
  },
  {
    level: 135,
    commonId: "zircon",
    rareId: "polished_zircon",
    rareChance: 0.1,
  },
  {
    level: 140,
    commonId: "void_stone",
    rareId: "requiem_stone",
    rareChance: 0.1,
  },
  {
    level: 145,
    commonId: "symbiotic_stone",
    rareId: "symbolic_stone",
    rareChance: 0.1,
  },
  { level: 150, commonId: "zircomet", rareId: "diromnathyst", rareChance: 0.1 },
  { level: 155, commonId: "fragmonnite", rareId: "ex_lex", rareChance: 0.1 },
]);

/** Nível máximo de minério existente no jogo (topo da tabela). */
export const MAX_ORE_LEVEL = ORE_LEVELS[ORE_LEVELS.length - 1]?.rockLevel ?? 0;

/** Retorna todos os minérios (entradas) de um dado nível de rocha. */
export function getOresByRockLevel(rockLevel: number): OreLevel[] {
  return ORE_LEVELS.filter((o) => o.rockLevel === rockLevel);
}

/** Nível mínimo de minério disponível (0) e o mais baixo com drop. */
export function getLowestOreLevel(): number {
  return ORE_LEVELS[0]?.rockLevel ?? 0;
}
