import { CRAFT_MATERIALS } from "@/data/items/crafting";
import { getEquipmentBySlotAndRank } from "@/data/equipment";
import type { EquipmentSlot, EquipmentRank } from "@/utils/types/player/equipment";

type ChestDropTable = {
  materialWeights: Record<string, number>;
  equipmentRankWeights: Record<EquipmentRank, number>;
};

export const CHEST_DROP_TABLES: Record<NPCClass, ChestDropTable> = {
  common: {
    materialWeights: { hungry_essence: 70, figurant_totem: 30 },
    equipmentRankWeights: { common: 85, rare: 13, epic: 2, boss: 0, legendary: 0 },
  },
  rare: {
    materialWeights: { rare_scale: 60, goat_horn: 40 },
    equipmentRankWeights: { common: 65, rare: 28, epic: 6, boss: 1, legendary: 0 },
  },
  epic: {
    materialWeights: { epic_core: 100 },
    equipmentRankWeights: { common: 35, rare: 35, epic: 22, boss: 7, legendary: 1 },
  },
  boss: {
    materialWeights: { boss_soul: 100 },
    equipmentRankWeights: { common: 15, rare: 30, epic: 32, boss: 18, legendary: 5 },
  },
  legendary: {
    materialWeights: { legendary_fragment: 100 },
    equipmentRankWeights: { common: 2, rare: 8, epic: 25, boss: 30, legendary: 35 },
  },
};

export type ChestDropResult = {
  materials: Array<{ id: string; name: string; qty: number }>;
  equipment: Array<{
    id: string;
    name: string;
    slot: EquipmentSlot;
    rank: EquipmentRank;
    enhance: number;
  }>;
};

const SLOTS: EquipmentSlot[] = [
  "weapon",
  "helmet",
  "chestplate",
  "pants",
  "boots",
  "accessory",
  "bag",
];

function pickWeighted(weights: Record<string, number>): string | null {
  const entries = Object.entries(weights).filter(([, w]) => w > 0);
  if (entries.length === 0) return null;
  const total = entries.reduce((sum, [, w]) => sum + w, 0);
  let roll = Math.random() * total;
  for (const [key, weight] of entries) {
    roll -= weight;
    if (roll <= 0) return key;
  }
  return entries[entries.length - 1][0];
}

export function openChest(chestTier: NPCClass): ChestDropResult {
  const table = CHEST_DROP_TABLES[chestTier];
  const dropCount = Math.floor(Math.random() * 7) + 5;
  const result: ChestDropResult = { materials: [], equipment: [] };

  for (let i = 0; i < dropCount; i++) {
    const isMaterial = Math.random() < 0.7;

    if (isMaterial) {
      const matId = pickWeighted(table.materialWeights);
      if (matId) {
        const def = CRAFT_MATERIALS[matId as keyof typeof CRAFT_MATERIALS];
        if (def) {
          const qty = Math.floor(Math.random() * 3) + 1;
          result.materials.push({ id: def.id, name: def.name, qty });
        }
      }
    } else {
      const rank = pickWeighted(table.equipmentRankWeights);
      if (!rank) continue;

      if (chestTier !== "legendary" && rank === "legendary") continue;

      const slot = SLOTS[Math.floor(Math.random() * SLOTS.length)];
      const candidates = getEquipmentBySlotAndRank(slot, rank as EquipmentRank);
      if (candidates.length === 0) continue;

      const equip = candidates[Math.floor(Math.random() * candidates.length)];
      const enhance = Math.floor(Math.random() * 6);
      result.equipment.push({
        id: equip.id,
        name: equip.name,
        slot: equip.slot,
        rank: equip.rank,
        enhance,
      });
    }
  }

  return result;
}
