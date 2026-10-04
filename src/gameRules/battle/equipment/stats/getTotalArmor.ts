import type { DamageArmor } from "@/utils/types/battle/damageKind";
import { getResistanceArmor } from "./getResistanceArmos";
import { getTotalStat } from "./getTotalStat";

/**
 * Armadura total do personagem, já separada nas duas colunas.
 *
 * O stat `armor` do equipamento é a base das duas — é ele que mantém todo o
 * dado existente (33 itens, 14 títulos) com o mesmo peso de antes. As chaves
 * `physicalArmor`/`magicalArmor` são o excedente para quem blindar só um lado.
 * Resistência é um stat genérico de defesa, então também entra nas duas.
 */
export function getTotalArmor(
  character: CharacterId,
  resistance?: number,
): DamageArmor {
  const base = resistance !== undefined ? getResistanceArmor(resistance) : 0;
  const shared = getTotalStat(character, "armor");

  return {
    physical: base + shared + getTotalStat(character, "physicalArmor"),
    magical: base + shared + getTotalStat(character, "magicalArmor"),
  };
}
