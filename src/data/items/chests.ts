import { CRAFT_MATERIALS } from "@/data/items/crafting";
import { ITEMS } from "@/data/items";
import { getEquipmentBySlotAndRank } from "@/data/equipment";
import { PETS } from "@/data/equipment/pets";
import type { EquipmentRank } from "@/utils/types/player/equipment";

type ChestDropTable = {
  materialWeights: Record<string, number>;
  equipmentRankWeights: Record<EquipmentRank, number>;
  petDropChance: number;
};

export const CHEST_DROP_TABLES: Record<NPCClass, ChestDropTable> = {
  common: {
    materialWeights: {
      hungry_essence: 70,
      figurant_totem: 30,
      xp_potion_common: 15,
    },
    equipmentRankWeights: {
      1: 50,
      2: 30,
      3: 13,
      4: 5,
      5: 2,
      6: 0,
      7: 0,
      8: 0,
      9: 0,
      0: 0,
      EX: 0,
    },
    petDropChance: 0.01,
  },
  rare: {
    materialWeights: { rare_scale: 60, goat_horn: 40, xp_potion_rare: 12 },
    equipmentRankWeights: {
      1: 15,
      2: 30,
      3: 25,
      4: 15,
      5: 10,
      6: 4,
      7: 1,
      8: 0,
      9: 0,
      0: 0,
      EX: 0,
    },
    petDropChance: 0.03,
  },
  epic: {
    materialWeights: { epic_core: 100, xp_potion_epic: 10 },
    equipmentRankWeights: {
      1: 5,
      2: 10,
      3: 20,
      4: 20,
      5: 20,
      6: 12,
      7: 8,
      8: 4,
      9: 1,
      0: 0,
      EX: 0,
    },
    petDropChance: 0.07,
  },
  boss: {
    materialWeights: { boss_soul: 100, xp_potion_boss: 8 },
    equipmentRankWeights: {
      1: 0,
      2: 5,
      3: 10,
      4: 15,
      5: 20,
      6: 18,
      7: 15,
      8: 10,
      9: 5,
      0: 2,
      EX: 0,
    },
    petDropChance: 0.12,
  },
  legendary: {
    materialWeights: { legendary_fragment: 100, xp_potion_legendary: 5 },
    equipmentRankWeights: {
      1: 0,
      2: 0,
      3: 2,
      4: 5,
      5: 10,
      6: 15,
      7: 20,
      8: 18,
      9: 15,
      0: 10,
      EX: 5,
    },
    petDropChance: 0.2,
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
  pets: Array<{
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

export function openChest(
  chestTier: NPCClass,
  petChance?: number,
): ChestDropResult {
  const table = CHEST_DROP_TABLES[chestTier];
  const dropCount = Math.floor(Math.random() * 7) + 5;
  const result: ChestDropResult = { materials: [], equipment: [], pets: [] };

  for (let i = 0; i < dropCount; i++) {
    const isMaterial = Math.random() < 0.7;

    if (isMaterial) {
      const matId = pickWeighted(table.materialWeights);
      if (matId) {
        const craftDef = CRAFT_MATERIALS[matId as keyof typeof CRAFT_MATERIALS];
        if (craftDef) {
          const qty = Math.floor(Math.random() * 3) + 1;
          result.materials.push({ id: craftDef.id, name: craftDef.name, qty });
        } else {
          const itemDef = ITEMS[matId as keyof typeof ITEMS];
          if (itemDef) {
            const qty = Math.floor(Math.random() * 3) + 1;
            result.materials.push({
              id: matId as string,
              name: itemDef.name,
              qty,
            });
          }
        }
      }
    } else {
      const rank = pickWeighted(table.equipmentRankWeights);
      if (!rank) continue;

      const rankId = rank as unknown as EquipmentRank;
      if (chestTier !== "legendary" && (rankId === "EX" || rankId === 0))
        continue;

      const slot = SLOTS[Math.floor(Math.random() * SLOTS.length)];
      const candidates = getEquipmentBySlotAndRank(slot, rankId).filter(
        (e) => !e.craftOnly,
      );
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

  const chance = petChance ?? table.petDropChance;
  if (chance > 0 && Math.random() < chance) {
    const pet = PETS[Math.floor(Math.random() * PETS.length)];
    result.pets.push({
      id: pet.id,
      name: pet.name,
      slot: pet.slot,
      rank: pet.rank,
      enhance: 0,
    });
  }

  return result;
}
