import { ARMOR_SLOTS } from "@/data/equipment/definitions";
import { getEquipmentById } from "@/data/equipment";
import { equipmentSeed } from "../enhance";
import { advanceSeed } from "./advanceSeed";
import { RESISTANCE_DROP_CHANCE } from "@/data/equipment/statResistance";
import { isEpicOrHigher } from "./isEpicOrHigher";


export type EquipmentResistances = {
  heat: boolean;
  cold: boolean;
  blind: boolean;
};

export function getItemResistances(
  itemId: EquipmentId,
  enhance: number,
): EquipmentResistances {
  const item = getEquipmentById(itemId);
  if (!item) return { heat: false, cold: false, blind: false };
  if (!(ARMOR_SLOTS as readonly string[]).includes(item.slot))
    return { heat: false, cold: false, blind: false };
  if (!isEpicOrHigher(item.rank))
    return { heat: false, cold: false, blind: false };

  let seed = advanceSeed(equipmentSeed(itemId), enhance);

  const heat = seed % 100 < RESISTANCE_DROP_CHANCE * 100;
  seed = advanceSeed(seed, 1);
  const cold = seed % 100 < RESISTANCE_DROP_CHANCE * 100;
  seed = advanceSeed(seed, 1);
  const blind =
    item.slot === "helmet" && seed % 100 < RESISTANCE_DROP_CHANCE * 100;

  return { heat, cold, blind };
}