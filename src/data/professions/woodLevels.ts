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
export const WOOD_LEVELS: WoodLevel[] = [
  { treeLevel: 0, commonId: "ash_wood", rareId: "jonik_ash_wood", xp: 10, rareChance: 0.05 },
  { treeLevel: 5, commonId: "hazel_wood", rareId: "babezel_wood", xp: 15, rareChance: 0.05 },
  { treeLevel: 10, commonId: "chestnut_wood", rareId: "rare_chestnut_wood", xp: 20, rareChance: 0.05 },
  { treeLevel: 15, commonId: "apiwood", rareId: "premier_api_wood", xp: 25, rareChance: 0.05 },
  { treeLevel: 20, commonId: "birch_wood", rareId: "rare_birch_wood", xp: 30, rareChance: 0.06 },
  { treeLevel: 25, commonId: "baobab_wood", rareId: "rare_baobab_wood", xp: 35, rareChance: 0.06 },
  { treeLevel: 30, commonId: "weeping_willow_wood", rareId: "rare_weeping_willow_wood", xp: 40, rareChance: 0.06 },
  { treeLevel: 35, commonId: "citronana_wood", rareId: "rare_citronana_wood", xp: 45, rareChance: 0.06 },
  { treeLevel: 40, commonId: "baby_redwood_wood", rareId: "rare_baby_redwood_wood", xp: 50, rareChance: 0.06 },
  { treeLevel: 45, commonId: "pooplar_wood", rareId: "rare_pooplar_wood", xp: 55, rareChance: 0.07 },
  { treeLevel: 50, commonId: "hornbeam_wood", rareId: "rare_hornbeam_wood", xp: 60, rareChance: 0.07 },
  { treeLevel: 55, commonId: "tadbole_wood", rareId: "rare_tadbole_wood", xp: 65, rareChance: 0.07 },
  { treeLevel: 60, commonId: "climbing_tree", rareId: "rare_climbing_tree", xp: 70, rareChance: 0.07 },
  { treeLevel: 65, commonId: "frozen_wood", rareId: "rare_frozen_wood", xp: 75, rareChance: 0.07 },
  { treeLevel: 70, commonId: "yew_wood", rareId: "rare_yew_wood", xp: 80, rareChance: 0.07 },
  { treeLevel: 75, commonId: "prickly_wood", rareId: "rare_prickly_wood", xp: 85, rareChance: 0.08 },
  { treeLevel: 80, commonId: "mosscandel_wood", rareId: "rare_mosscandel_wood", xp: 90, rareChance: 0.08 },
  { treeLevel: 85, commonId: "marmalot_wood", rareId: "rare_marmalot_wood", xp: 95, rareChance: 0.08 },
  { treeLevel: 90, commonId: "elderberry_wood", rareId: "rare_elderberry_wood", xp: 100, rareChance: 0.08 },
  { treeLevel: 95, commonId: "sylvan_wood", rareId: "rare_sylvan_wood", xp: 105, rareChance: 0.08 },
  { treeLevel: 100, commonId: "dry_wood", rareId: "rare_dry_wood", xp: 110, rareChance: 0.09 },
  { treeLevel: 105, commonId: "cherry_tree_wood", rareId: "rare_cherry_tree_wood", xp: 115, rareChance: 0.09 },
  { treeLevel: 110, commonId: "divi_divi_wood", rareId: "divi_up_wood", xp: 120, rareChance: 0.09 },
  { treeLevel: 115, commonId: "kokonut_wood", rareId: "rare_kokonut_wood", xp: 125, rareChance: 0.09 },
  { treeLevel: 120, commonId: "mahogany_wood", rareId: "rare_mahogany_wood", xp: 130, rareChance: 0.09 },
  { treeLevel: 125, commonId: "bramble_wood", rareId: "rare_bramble_wood", xp: 135, rareChance: 0.1 },
  { treeLevel: 130, commonId: "carya_wood", rareId: "rare_carya_wood", xp: 140, rareChance: 0.1 },
  { treeLevel: 135, commonId: "twisted_seaweed_wood", rareId: "rare_twisted_seaweed_wood", xp: 145, rareChance: 0.1 },
  { treeLevel: 140, commonId: "despair_tree_wood", rareId: "desolation_wood", xp: 150, rareChance: 0.1 },
  { treeLevel: 145, commonId: "nonbeeching_wood", rareId: "madness_wood", xp: 155, rareChance: 0.1 },
  { treeLevel: 150, commonId: "astracacia", rareId: "moon_of_changing_eras", xp: 160, rareChance: 0.1 },
  { treeLevel: 155, commonId: "luzyl", rareId: "lazu_luzyl", xp: 165, rareChance: 0.1 },
] as const satisfies WoodLevel[];

/** Nível máximo de madeira existente no jogo (topo da tabela). */
export const MAX_WOOD_LEVEL = WOOD_LEVELS[WOOD_LEVELS.length - 1]?.treeLevel ?? 0;

export function getWoodLevelByTreeLevel(
  treeLevel: number,
): WoodLevel | undefined {
  return WOOD_LEVELS.find((w) => w.treeLevel === treeLevel);
}
