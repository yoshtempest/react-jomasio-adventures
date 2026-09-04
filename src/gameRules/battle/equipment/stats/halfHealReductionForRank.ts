import { RANK_INDEX } from "@/data/equipment/definitions";

export function halfHealReductionForRank(rank: EquipmentRank): number {
  const idx = RANK_INDEX[rank];
  if (idx < 4) return 0;
  return Math.round(((idx - 4) / 6) * 40);
}