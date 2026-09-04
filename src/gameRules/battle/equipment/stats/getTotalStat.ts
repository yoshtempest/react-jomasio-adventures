import type { EquipmentStats } from "@/utils/types/player/equipment";
import { loadEquipped } from "@/data/equipment/storage";
import { getActiveSetItemIds } from "../sets";
import { sumEquippedStat } from "./sumEquippedStat";

export function getTotalStat(
  character: CharacterId,
  stat: keyof EquipmentStats,
): number {
  const equipped = loadEquipped(character);
  const setItemIds = getActiveSetItemIds(character);
  return sumEquippedStat(equipped, stat, setItemIds);
}