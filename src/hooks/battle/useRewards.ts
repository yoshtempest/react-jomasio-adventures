import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";

import { calculateXP } from "@/utils/calculateXp";

import { rollSlotDrop } from "@/data/equipment/drops";
import { EQUIPMENT_LIST } from "@/data/equipment";
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

      const equipment = EQUIPMENT_LIST.find(
        (e) => e.slot === slot && e.rank === rank,
      );

      if (equipment) {
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

    if (npcType.startsWith("goat") && Math.random() < 0.01) {
      const enhance = rollEnhance();
      addDrop(player.character, "pet_goat", enhance);
      const pet = EQUIPMENT_LIST.find((e) => e.id === "pet_goat");
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

    return { coinReward, xpReward, equipmentDrops, itemDrops };
  }

  return {
    xpReward,
    coinReward,
    giveRewards,
    giveSummonRewards,
  };
}
