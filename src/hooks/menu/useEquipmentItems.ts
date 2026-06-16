import { useEquipment } from "@/contexts/EquipmentContext";
import { getEquipmentById } from "@/data/equipment";
import { getEffectiveStats } from "@/gameRules/battle/equipment";
import { EQUIPMENT_SLOTS } from "@/utils/types/player/equipment";
import type { Equipment, EquipmentStats } from "@/utils/types/player/equipment";
import type { EquipmentFilter } from "@/utils/equipmentMenu";

function parseColKey(key: string): { id: string; enhance: number } {
  const i = key.lastIndexOf("+");
  if (i > 0) {
    const enhance = parseInt(key.slice(i + 1), 10);
    if (!isNaN(enhance)) return { id: key.slice(0, i), enhance };
  }
  return { id: key, enhance: 0 };
}

export type CollectedEntry = {
  item: Equipment;
  qty: number;
  enhance: number;
  stats: ReturnType<typeof getEffectiveStats>;
};

export type EquippedEntry = {
  type: "slot";
  slot: (typeof EQUIPMENT_SLOTS)[number];
  item: Equipment | null;
  info: { id: EquipmentId; enhance: number } | null;
  stats: EquipmentStats | null;
};

export function useEquipmentItems(character: CharacterId, filter: EquipmentFilter) {
  const { getEquippedItem, getEquippedInfo, getCollection } = useEquipment();

  const equippedItems: EquippedEntry[] = EQUIPMENT_SLOTS.map((slot) => {
    const item = getEquippedItem(character, slot);
    const info = getEquippedInfo(character, slot);
    return {
      type: "slot" as const,
      slot,
      item,
      info,
      stats: item && info ? getEffectiveStats(info.id, info.enhance) : null,
    };
  });

  const allCollected: CollectedEntry[] = Object.entries(
    getCollection(character),
  )
    .filter(([, qty]) => (qty as number) > 0)
    .map(([key, qty]) => {
      const { id, enhance } = parseColKey(key);
      const item = getEquipmentById(id);
      if (!item) return null;
      const stats = getEffectiveStats(id, enhance);
      return { item, qty: qty as number, enhance, stats } as CollectedEntry;
    })
    .filter((e): e is CollectedEntry => e !== null);

  const filteredItems =
    filter === "all"
      ? allCollected
      : allCollected.filter(({ item }) => item.slot === filter);

  return { equippedItems, allCollected, filteredItems };
}
