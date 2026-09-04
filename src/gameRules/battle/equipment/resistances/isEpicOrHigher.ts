import type { EquipmentRank } from "@/utils/types/player/equipment";
import { RANK_INDEX } from "@/data/equipment/definitions";
import { MIN_RESISTANCE_RANK } from "@/data/equipment/statResistance";


export function isEpicOrHigher(rank: EquipmentRank): boolean {
  return RANK_INDEX[rank] >= RANK_INDEX[MIN_RESISTANCE_RANK];
}