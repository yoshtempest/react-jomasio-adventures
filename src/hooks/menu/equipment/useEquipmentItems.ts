import { useEquipment } from "@/contexts/EquipmentContext";
import { getEquipmentById } from "@/data/equipment";
import { getEffectiveStats } from "@/gameRules/battle/equipment";
import {
  EQUIPMENT_SLOTS,
  MAX_ACCESSORIES,
  ACCESSORY_UNLOCKED_COUNT,
} from "@/data/equipment/definitions";
import type {
  EquipmentStats,
  EquippedItemInfo,
} from "@/utils/types/player/equipment";
import type { EquipmentFilter } from "@/utils/equipment/equipmentMenu";
import type {
  CollectedEntry,
  EquippedEntry,
} from "@/utils/types/equipment/entrys";

function totalStats(stats: EquipmentStats): number {
  return (
    stats.hp +
    stats.strength +
    stats.intelligence +
    stats.armor +
    stats.shield +
    stats.vampirism +
    stats.reflect
  );
}

function parseColKey(key: string): { id: string; enhance: number } {
  const i = key.lastIndexOf("+");
  if (i > 0) {
    const enhance = parseInt(key.slice(i + 1), 10);
    if (!isNaN(enhance)) return { id: key.slice(0, i), enhance };
  }
  return { id: key, enhance: 0 };
}

export function useEquipmentItems(
  character: CharacterId,
  filter: EquipmentFilter,
) {
  const {
    getEquippedItem,
    getEquippedInfo,
    getEquippedAccessories,
    getCollection,
  } = useEquipment();

  const equippedItems: EquippedEntry[] = EQUIPMENT_SLOTS.filter(
    (slot) => slot !== "accessory",
  ).map((slot) => {
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

  const baseAccInfo = getEquippedInfo(character, "accessory");
  const accessories = getEquippedAccessories(character);
  const fills: (EquippedItemInfo | null)[] = baseAccInfo
    ? [baseAccInfo, ...accessories]
    : [...accessories];
  for (let i = fills.length; i < MAX_ACCESSORIES; i++) {
    fills.push(null);
  }
  for (let i = 0; i < MAX_ACCESSORIES; i++) {
    const info = fills[i];
    const item = info ? (getEquipmentById(info.id) ?? null) : null;
    equippedItems.push({
      type: "accessory-slot",
      index: i,
      item,
      info: info ?? null,
      stats: item && info ? getEffectiveStats(info.id, info.enhance) : null,
      locked: i >= ACCESSORY_UNLOCKED_COUNT,
    });
  }

  const equippedTotals = new Map<string, number>();
  for (const slot of EQUIPMENT_SLOTS) {
    const info = getEquippedInfo(character, slot);
    if (info) {
      equippedTotals.set(
        slot,
        totalStats(getEffectiveStats(info.id, info.enhance)),
      );
    }
  }

  const allCollected: CollectedEntry[] = Object.entries(
    getCollection(character),
  )
    .filter(([, qty]) => (qty) > 0)
    .map(([key, qty]) => {
      const { id, enhance } = parseColKey(key);
      const item = getEquipmentById(id);
      if (!item) return null;
      const stats = getEffectiveStats(id, enhance);
      const itemTotal = totalStats(stats);
      const equippedTotal = equippedTotals.get(item.slot);
      let arrow: "up" | "down" | null = null;
      if (equippedTotal !== undefined) {
        if (itemTotal > equippedTotal) arrow = "up";
        else if (itemTotal < equippedTotal) arrow = "down";
      } else if (itemTotal >= 0) {
        arrow = "up";
      }
      return {
        item,
        qty: qty,
        enhance,
        stats,
        arrow,
      };
    })
    .filter((e): e is CollectedEntry => e !== null)
    .sort((a, b) => totalStats(b.stats) - totalStats(a.stats));

  const filteredItems =
    filter === "all"
      ? allCollected
      : allCollected.filter(({ item }) => item.slot === filter);

  return { equippedItems, allCollected, filteredItems };
}
