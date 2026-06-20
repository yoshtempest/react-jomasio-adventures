import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";

import { calculateXP } from "@/utils/types/battle/calculateXp";
import {
  rollEquipmentDrops,
  rollMaterialDrops,
  rollChestDrop,
  rollKeyDrop,
  rollPetGoat,
} from "./useDrops";
import type { EquipmentSlot } from "@/utils/types/player/equipment";

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

    const equipmentDrops = rollEquipmentDrops(npcClass, addDrop, player.character);
    const itemDrops = rollMaterialDrops(npcClass, npcType, addItem);
    const chestDrop = rollChestDrop(npcClass, addItem, CHEST_DROP_CHANCE[npcClass]);
    const keyDrop = rollKeyDrop(npcClass, addItem, KEY_DROP_CHANCE[npcClass]);
    const petGoat = rollPetGoat(npcType, addDrop, player.character);

    if (petGoat) equipmentDrops.push(petGoat);

    return {
      coinReward,
      xpReward,
      equipmentDrops,
      itemDrops,
      chestDrop,
      keyDrop,
    };
  }

  return {
    xpReward,
    coinReward,
    giveRewards,
    giveSummonRewards,
  };
}
