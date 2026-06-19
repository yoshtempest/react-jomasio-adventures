import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";

import { calculateXP } from "@/utils/types/battle/calculateXp";

import { rollSlotDrop } from "@/data/equipment/drops";
import { getEquipmentBySlotAndRank, getEquipmentById } from "@/data/equipment";
import { rollCraftDrops } from "@/data/items/crafting";
import { ITEMS } from "@/data/items";
import type { EquipmentSlot } from "@/utils/types/player/equipment";

function rollEnhance(): number {
  return Math.floor(Math.random() * 6);
}

export type EquipmentDropInfo = {
  id: string;
  name: string;
  slot: EquipmentSlot;
  rank: EquipmentRank;
  enhance: number;
};

export type ItemDropInfo = {
  id: string;
  name: string;
  image?: string;
  qty: number;
};

export type RewardInfo = {
  coinReward: number;
  xpReward: number;
  equipmentDrops: EquipmentDropInfo[];
  itemDrops: ItemDropInfo[];
  chestDrop: { id: string; name: string } | null;
  keyDrop: { id: string; name: string } | null;
};

type Props = {
  npcClass: NPCClass;
  npcLevel: number;
  npcType: string;
};

export const COIN_REWARDS: Record<string, number> = {
  common: 5,
  rare: 10,
  epic: 25,
  boss: 50,
  legendary: 100,
};

export const CHEST_DROP_CHANCE: Record<NPCClass, number> = {
  common: 0.15,
  rare: 0.25,
  epic: 0.4,
  boss: 0.55,
  legendary: 0.7,
};

export const KEY_DROP_CHANCE: Record<NPCClass, number> = {
  common: 0.1,
  rare: 0.15,
  epic: 0.2,
  boss: 0.25,
  legendary: 0.35,
};

export function useBattleRewards({ npcClass, npcLevel, npcType }: Props) {
  const { player, addCoins } = usePlayer();
  const { addXP } = useCharacterProgress();
  const { addDrop } = useEquipment();
  const { addItem } = useInventory();

  const xpReward = calculateXP(npcLevel, npcClass) ?? 0;
  const coinReward = (COIN_REWARDS[npcClass] ?? 0) * npcLevel;

  function giveSummonRewards(npcClass: NPCClass) {
    const xp = calculateXP(npcLevel, npcClass) ?? 0;
    const coins = (COIN_REWARDS[npcClass] ?? 0) * npcLevel;

    addXP(player.character, xp);
    addCoins(coins);
  }

  function giveRewards(): RewardInfo {
    addXP(player.character, xpReward);
    addCoins(coinReward);

    const equipmentDrops: EquipmentDropInfo[] = [];
    const slots: EquipmentSlot[] = [
      "weapon",
      "helmet",
      "chestplate",
      "pants",
      "boots",
      "accessory",
      "bag",
    ];

    for (const slot of slots) {
      const rank = rollSlotDrop(npcClass);
      if (!rank) continue;

      // Highest ranks only come from chests
      if (rank === "EX") continue;
      if (rank >= 9) continue;

      const candidates = getEquipmentBySlotAndRank(slot, rank);
      if (candidates.length === 0) continue;

      const equipment =
        candidates[Math.floor(Math.random() * candidates.length)];
      const enhance = rollEnhance();
      addDrop(player.character, equipment.id, enhance);
      equipmentDrops.push({
        id: equipment.id,
        name: equipment.name,
        slot: equipment.slot,
        rank: equipment.rank,
        enhance,
      });
    }

    const itemDrops: ItemDropInfo[] = [];
    const materialDrops = rollCraftDrops(npcClass, npcType);
    for (const [materialId, qty] of Object.entries(materialDrops)) {
      const def = ITEMS[materialId as keyof typeof ITEMS];
      if (def) {
        const image = "image" in def ? def.image : undefined;
        addItem({ id: def.id, name: def.name, type: "material", qty, image });
        itemDrops.push({ id: def.id, name: def.name, qty, image });
      }
    }

    // Chest drop
    let chestDrop: { id: string; name: string } | null = null;
    if (Math.random() < CHEST_DROP_CHANCE[npcClass]) {
      const chestId = `${npcClass}_chest` as const;
      const def = ITEMS[chestId as keyof typeof ITEMS];
      if (def) {
        addItem({ id: def.id, name: def.name, type: "chest" });
        chestDrop = { id: def.id, name: def.name };
      }
    }

    // Key drop
    let keyDrop: { id: string; name: string } | null = null;
    if (Math.random() < KEY_DROP_CHANCE[npcClass]) {
      const keyId = `${npcClass}_key` as const;
      const def = ITEMS[keyId as keyof typeof ITEMS];
      if (def) {
        addItem({ id: def.id, name: def.name, type: "key" });
        keyDrop = { id: def.id, name: def.name };
      }
    }

    if (npcType.startsWith("goat") && Math.random() < 0.01) {
      const enhance = rollEnhance();
      addDrop(player.character, "pet_goat", enhance);
      const pet = getEquipmentById("pet_goat");
      if (pet) {
        equipmentDrops.push({
          id: pet.id,
          name: pet.name,
          slot: pet.slot,
          rank: pet.rank,
          enhance,
        });
      }
    }

    return { coinReward, xpReward, equipmentDrops, itemDrops, chestDrop, keyDrop };
  }

  return {
    xpReward,
    coinReward,
    giveRewards,
    giveSummonRewards,
  };
}
