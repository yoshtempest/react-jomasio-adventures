import { getEffectiveStats } from "@/gameRules/battle/equipment";
import { EQUIPMENT_SLOTS } from "@/utils/types/player/equipment";
import type { Equipment, EquipmentStats } from "@/utils/types/player/equipment";

export type CollectedEntry = {
  item: Equipment;
  qty: number;
  enhance: number;
  stats: ReturnType<typeof getEffectiveStats>;
  arrow: "up" | "down" | null;
};

export type EquippedEntry =
  | {
      type: "slot";
      slot: (typeof EQUIPMENT_SLOTS)[number];
      item: Equipment | null;
      info: { id: EquipmentId; enhance: number } | null;
      stats: EquipmentStats | null;
    }
  | {
      type: "accessory-slot";
      index: number;
      item: Equipment | null;
      info: { id: EquipmentId; enhance: number } | null;
      stats: EquipmentStats | null;
      locked: boolean;
    };
