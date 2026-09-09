import { createLevels } from "@/utils/professions/createLevel";

/**
 * Níveis de madeira para a profissão Lenhador.
 *
 * Cada nível define a madeira "comum" (drop garantido) e a sua "forma rara"
 * (item dropável da profissão, dropado com chance). Os níveis são fixos:
 * um nível por madeira, do nv.0 (Ash Wood) ao nv.155 (Luzyl).
 *
 * A profissão Lenhador precisa estar em nv >= treeLevel para interagir.
 * A cada 5 níveis temos um item dropável da profissão (a forma rara).
 */
export type WoodLevel = {
  treeLevel: number;
  commonId: ItemId;
  rareId: ItemId;
  /** XP base fornecido ao lenhar esta árvore (antes do scaling por nível). */
  xp: number;
  /** Chance de dropar a forma rara (0-1). */
  rareChance: number;
};

/** Nome/variante rara por nível, do nv.0 ao nv.155. */
export const WOOD_LEVELS: WoodLevel[] = createLevels("treeLevel", [
  {
    level: 0,
    commonId: "ash_wood",
    rareId: "jonik_ash_wood",
    rareChance: 0.05,
  },
  {
    level: 5,
    commonId: "hazel_wood",
    rareId: "babezel_wood",
    rareChance: 0.05,
  },
  {
    level: 10,
    commonId: "chestnut_wood",
    rareId: "rare_chestnut_wood",
    rareChance: 0.05,
  },
  {
    level: 15,
    commonId: "apiwood",
    rareId: "premier_api_wood",
    rareChance: 0.05,
  },
  {
    level: 20,
    commonId: "birch_wood",
    rareId: "rare_birch_wood",
    rareChance: 0.06,
  },
  {
    level: 25,
    commonId: "baobab_wood",
    rareId: "rare_baobab_wood",
    rareChance: 0.06,
  },
  {
    level: 30,
    commonId: "weeping_willow_wood",
    rareId: "rare_weeping_willow_wood",
    rareChance: 0.06,
  },
  {
    level: 35,
    commonId: "citronana_wood",
    rareId: "rare_citronana_wood",
    rareChance: 0.06,
  },
  {
    level: 40,
    commonId: "baby_redwood_wood",
    rareId: "rare_baby_redwood_wood",
    rareChance: 0.06,
  },
  {
    level: 45,
    commonId: "pooplar_wood",
    rareId: "rare_pooplar_wood",
    rareChance: 0.07,
  },
  {
    level: 50,
    commonId: "hornbeam_wood",
    rareId: "rare_hornbeam_wood",
    rareChance: 0.07,
  },
  {
    level: 55,
    commonId: "tadbole_wood",
    rareId: "rare_tadbole_wood",
    rareChance: 0.07,
  },
  {
    level: 60,
    commonId: "climbing_tree",
    rareId: "rare_climbing_tree",
    rareChance: 0.07,
  },
  {
    level: 65,
    commonId: "frozen_wood",
    rareId: "rare_frozen_wood",
    rareChance: 0.07,
  },
  {
    level: 70,
    commonId: "yew_wood",
    rareId: "rare_yew_wood",
    rareChance: 0.07,
  },
  {
    level: 75,
    commonId: "prickly_wood",
    rareId: "rare_prickly_wood",
    rareChance: 0.08,
  },
  {
    level: 80,
    commonId: "mosscandel_wood",
    rareId: "rare_mosscandel_wood",
    rareChance: 0.08,
  },
  {
    level: 85,
    commonId: "marmalot_wood",
    rareId: "rare_marmalot_wood",
    rareChance: 0.08,
  },
  {
    level: 90,
    commonId: "elderberry_wood",
    rareId: "rare_elderberry_wood",
    rareChance: 0.08,
  },
  {
    level: 95,
    commonId: "sylvan_wood",
    rareId: "rare_sylvan_wood",
    rareChance: 0.08,
  },
  {
    level: 100,
    commonId: "dry_wood",
    rareId: "rare_dry_wood",
    rareChance: 0.09,
  },
  {
    level: 105,
    commonId: "cherry_tree_wood",
    rareId: "rare_cherry_tree_wood",
    rareChance: 0.09,
  },
  {
    level: 110,
    commonId: "divi_divi_wood",
    rareId: "divi_up_wood",
    rareChance: 0.09,
  },
  {
    level: 115,
    commonId: "kokonut_wood",
    rareId: "rare_kokonut_wood",
    rareChance: 0.09,
  },
  {
    level: 120,
    commonId: "mahogany_wood",
    rareId: "rare_mahogany_wood",
    rareChance: 0.09,
  },
  {
    level: 125,
    commonId: "bramble_wood",
    rareId: "rare_bramble_wood",
    rareChance: 0.1,
  },
  {
    level: 130,
    commonId: "carya_wood",
    rareId: "rare_carya_wood",
    rareChance: 0.1,
  },
  {
    level: 135,
    commonId: "twisted_seaweed_wood",
    rareId: "rare_twisted_seaweed_wood",
    rareChance: 0.1,
  },
  {
    level: 140,
    commonId: "despair_tree_wood",
    rareId: "desolation_wood",
    rareChance: 0.1,
  },
  {
    level: 145,
    commonId: "nonbeeching_wood",
    rareId: "madness_wood",
    rareChance: 0.1,
  },
  {
    level: 150,
    commonId: "astracacia",
    rareId: "moon_of_changing_eras",
    rareChance: 0.1,
  },
  { level: 155, commonId: "luzyl", rareId: "lazu_luzyl", rareChance: 0.1 },
]);

/** Nível máximo de madeira existente no jogo (topo da tabela). */
export const MAX_WOOD_LEVEL =
  WOOD_LEVELS[WOOD_LEVELS.length - 1]?.treeLevel ?? 0;

export function getWoodLevelByTreeLevel(
  treeLevel: number,
): WoodLevel | undefined {
  return WOOD_LEVELS.find((w) => w.treeLevel === treeLevel);
}
