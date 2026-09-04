import { getResistanceArmor } from "./getResistanceArmos";
import { getTotalStat } from "./getTotalStat";

export function getTotalArmor(
  character: CharacterId,
  resistance?: number,
): number {
  const base = resistance !== undefined ? getResistanceArmor(resistance) : 0;
  return base + getTotalStat(character, "armor");
}