import {
  ENCHANTMENT_PROC_CHANCE,
  type Enchantment,
} from "@/data/equipment/enchantments";

/**
 * Sorteia se o encantamento aplica o status neste hit.
 *
 * Args:
 *     enchantment (Enchantment | null): encantamento da arma equipada.
 *
 * Returns:
 *     `true` quando o status deve ser aplicado no inimigo.
 */
export function rollEnchantmentProc(enchantment: Enchantment | null): boolean {
  if (!enchantment) return false;
  return Math.random() < ENCHANTMENT_PROC_CHANCE;
}
