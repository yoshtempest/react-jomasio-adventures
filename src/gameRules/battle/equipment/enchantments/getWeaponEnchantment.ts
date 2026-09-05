import { getEquipmentById } from "@/data/equipment";
import { RANK_INDEX } from "@/data/equipment/definitions";
import {
  ENCHANTMENTS,
  ENCHANTMENT_DROP_CHANCE,
  MIN_ENCHANTMENT_RANK,
  type Enchantment,
} from "@/data/equipment/enchantments";
import { equipmentSeed } from "../enhance";
import { advanceSeed } from "../resistances/advanceSeed";

/**
 * Bits altos da seed, como valor positivo.
 *
 * O LCG de `advanceSeed` tem período curtíssimo nos bits baixos: `seed % 4`
 * saiu constante numa amostragem de todas as 69 armas do jogo, e as 23
 * elegíveis receberam o mesmo encantamento. Descartar os 16 bits de baixo
 * resolve — sem isso, "sorteio" aqui é só uma constante disfarçada.
 */
function highBits(seed: number): number {
  return Math.abs(Math.floor(seed / 65536));
}

/**
 * Encantamento da arma, derivado do id.
 *
 * Mesma abordagem determinística das resistências de armadura
 * (`getItemResistances`): nada é gravado no save, o valor é sempre
 * recalculado. Diferente delas, **não** entra o nível de aprimoramento — o
 * encantamento é característica da arma, e fazer ele aparecer e sumir a cada
 * `+1` seria punir quem aprimora.
 *
 * Args:
 *     itemId (EquipmentId): id do equipamento.
 *
 * Returns:
 *     O encantamento da arma, ou `null` quando a peça não é arma, está
 *     abaixo do rank mínimo, ou não sorteou encantamento.
 */
export function getWeaponEnchantment(itemId: EquipmentId): Enchantment | null {
  const item = getEquipmentById(itemId);
  if (!item) return null;
  if (item.slot !== "weapon") return null;
  if (RANK_INDEX[item.rank] < RANK_INDEX[MIN_ENCHANTMENT_RANK]) return null;

  const seed = equipmentSeed(itemId);
  if (highBits(seed) % 100 >= ENCHANTMENT_DROP_CHANCE * 100) return null;

  const kindSeed = highBits(advanceSeed(seed, 1));
  return ENCHANTMENTS[kindSeed % ENCHANTMENTS.length] ?? null;
}
