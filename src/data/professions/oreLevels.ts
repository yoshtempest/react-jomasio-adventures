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

export const ORE_LEVELS: OreLevel[] = [
  {
    rockLevel: 0,
    commonId: "iron_ore",
    rareId: "crystalline_iron_ore",
    xp: 10,
    rareChance: 0.05,
  },
  {
    rockLevel: 0,
    commonId: "tin_ore",
    rareId: "glow_tin_ore",
    xp: 10,
    rareChance: 0.05,
  },
  {
    rockLevel: 5,
    commonId: "finest_sea_salt",
    rareId: "verbala_salt",
    xp: 15,
    rareChance: 0.05,
  },
  {
    rockLevel: 10,
    commonId: "classic_carbon",
    rareId: "burning_coal",
    xp: 20,
    rareChance: 0.05,
  },
  {
    rockLevel: 15,
    commonId: "copper_ore",
    rareId: "trombone_ore",
    xp: 25,
    rareChance: 0.05,
  },
  {
    rockLevel: 20,
    commonId: "shadowy_cobalt",
    rareId: "darkness_cobalt",
    xp: 30,
    rareChance: 0.06,
  },
  {
    rockLevel: 25,
    commonId: "bronze_nugget",
    rareId: "consolatory_bronze",
    xp: 35,
    rareChance: 0.06,
  },
  {
    rockLevel: 30,
    commonId: "shard_of_flint",
    rareId: "flammable_flint",
    xp: 40,
    rareChance: 0.06,
  },
  {
    rockLevel: 35,
    commonId: "rugged_quartz",
    rareId: "smoked_quartz",
    xp: 45,
    rareChance: 0.06,
  },
  {
    rockLevel: 40,
    commonId: "grievous_kroomium",
    rareId: "flamboyant_kroomium",
    xp: 50,
    rareChance: 0.06,
  },
  {
    rockLevel: 45,
    commonId: "wholesome_zinc",
    rareId: "shiny_zinc",
    xp: 55,
    rareChance: 0.07,
  },
  {
    rockLevel: 50,
    commonId: "royal_bauxite",
    rareId: "imperial_bauxite",
    xp: 60,
    rareChance: 0.07,
  },
  {
    rockLevel: 55,
    commonId: "blood_red_amethyst",
    rareId: "dragonheart_amethyst",
    xp: 65,
    rareChance: 0.07,
  },
  {
    rockLevel: 60,
    commonId: "koral",
    rareId: "koral_reef",
    xp: 70,
    rareChance: 0.07,
  },
  {
    rockLevel: 65,
    commonId: "taroudium_ore",
    rareId: "polished_taroudium",
    xp: 75,
    rareChance: 0.07,
  },
  {
    rockLevel: 70,
    commonId: "hazy_lead_ore",
    rareId: "luminous_lead_ore",
    xp: 80,
    rareChance: 0.07,
  },
  {
    rockLevel: 75,
    commonId: "sandy_ore",
    rareId: "rose_of_the_sands",
    xp: 85,
    rareChance: 0.08,
  },
  {
    rockLevel: 80,
    commonId: "black_gold",
    rareId: "onyx_ore",
    xp: 90,
    rareChance: 0.08,
  },
  {
    rockLevel: 85,
    commonId: "mythwil_ore",
    rareId: "sumptuous_mythwil_ore",
    xp: 95,
    rareChance: 0.08,
  },
  {
    rockLevel: 90,
    commonId: "double_carat_sapphire_stone",
    rareId: "dull_sapphire",
    xp: 100,
    rareChance: 0.08,
  },
  {
    rockLevel: 95,
    commonId: "sovereign_titanium",
    rareId: "foreal_titanium",
    xp: 105,
    rareChance: 0.08,
  },
  {
    rockLevel: 100,
    commonId: "sryanide_ore",
    rareId: "acid_sryanure",
    xp: 110,
    rareChance: 0.09,
  },
  {
    rockLevel: 105,
    commonId: "dark_carbon",
    rareId: "carbon_hara",
    xp: 115,
    rareChance: 0.09,
  },
  {
    rockLevel: 110,
    commonId: "amber",
    rareId: "prehistoric_amber",
    xp: 120,
    rareChance: 0.09,
  },
  {
    rockLevel: 115,
    commonId: "mercury",
    rareId: "chrome_plated_mercury",
    xp: 125,
    rareChance: 0.09,
  },
  {
    rockLevel: 120,
    commonId: "silver_ore",
    rareId: "shiny_silver_ore",
    xp: 130,
    rareChance: 0.09,
  },
  {
    rockLevel: 125,
    commonId: "obsidian_ore",
    rareId: "iridescent_obsidian",
    xp: 135,
    rareChance: 0.1,
  },
  {
    rockLevel: 130,
    commonId: "frozen_garnet",
    rareId: "absolute_garnet",
    xp: 140,
    rareChance: 0.1,
  },
  {
    rockLevel: 135,
    commonId: "zircon",
    rareId: "polished_zircon",
    xp: 145,
    rareChance: 0.1,
  },
  {
    rockLevel: 140,
    commonId: "void_stone",
    rareId: "requiem_stone",
    xp: 150,
    rareChance: 0.1,
  },
  {
    rockLevel: 145,
    commonId: "symbiotic_stone",
    rareId: "symbolic_stone",
    xp: 155,
    rareChance: 0.1,
  },
  {
    rockLevel: 150,
    commonId: "zircomet",
    rareId: "diromnathyst",
    xp: 160,
    rareChance: 0.1,
  },
  {
    rockLevel: 155,
    commonId: "fragmonnite",
    rareId: "ex_lex",
    xp: 165,
    rareChance: 0.1,
  },
] as const satisfies OreLevel[];

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
