import { ONE_THOUSAND_MS, THREE_THOUSAND_MS, FIVE_THOUSAND_MS } from "@/data/ms";

/** Status negativo que uma arma encantada pode aplicar no inimigo. */
export const ENCHANTMENTS = ["burn", "freeze", "poison", "bleed"] as const;

export type Enchantment = (typeof ENCHANTMENTS)[number];

/** Chance, por hit no inimigo, de o encantamento aplicar o status. */
export const ENCHANTMENT_PROC_CHANCE = 0.05;

/** Rank mínimo da arma para ela nascer encantada. */
export const MIN_ENCHANTMENT_RANK: EquipmentRank = 5;

/** Fração das armas elegíveis que recebe encantamento. */
export const ENCHANTMENT_DROP_CHANCE = 0.4;

export const ENCHANTMENT_DURATION_MS: Record<Enchantment, number> = {
  burn: FIVE_THOUSAND_MS,
  freeze: THREE_THOUSAND_MS,
  poison: FIVE_THOUSAND_MS,
  bleed: FIVE_THOUSAND_MS,
};

/** Dano por tick dos status que causam dano ao longo do tempo. */
export const ENCHANTMENT_TICK_DAMAGE: Record<Enchantment, number> = {
  burn: 3,
  freeze: 0,
  poison: 2,
  bleed: 2,
};

export const ENCHANTMENT_TICK_INTERVAL_MS = ONE_THOUSAND_MS;

export const ENCHANTMENT_LABELS: Record<Enchantment, string> = {
  burn: "Queimadura",
  freeze: "Congelamento",
  poison: "Veneno",
  bleed: "Sangramento",
};
