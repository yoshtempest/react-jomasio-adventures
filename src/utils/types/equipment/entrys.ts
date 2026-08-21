import { getEffectiveStats } from "@/gameRules/battle/equipment";
import type {
  Equipment,
  EquipmentSlot,
  EquipmentStats,
} from "@/utils/types/player/equipment";

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
      slot: EquipmentSlot;
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
