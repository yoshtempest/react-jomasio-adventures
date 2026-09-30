/**
 * Níveis de peso para a profissão Bodybuilder.
 *
 * Cada nível define o peso "comum" (drop garantido) e a sua "forma rara"
 * (item dropável da profissão, dropado com chance). Os níveis são fixos: um
 * nível por peso, do nv.0 (Halter de 1 kg) ao nv.155 (Anilha de 100 kg).
 *
 * A profissão Bodybuilder precisa estar em nv >= weightLevel para treinar
 * com o peso. A cada 5 níveis temos um item dropável da profissão (a forma
 * rara).
 */
export type WeightLevel = {
  weightLevel: number;
  commonId: ItemId;
  rareId: ItemId;
  /** XP base fornecido ao treinar com este peso (antes do scaling por nível). */
  xp: number;
  /** Chance de dropar a forma rara (0-1). */
  rareChance: number;
};
