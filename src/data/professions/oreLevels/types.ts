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
