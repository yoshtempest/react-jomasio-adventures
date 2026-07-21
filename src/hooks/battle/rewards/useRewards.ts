import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePetProgress } from "@/contexts/PetProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import {
  COIN_REWARDS,
  CHEST_DROP_CHANCE,
  KEY_DROP_CHANCE,
} from "@/data/battle/drops";
import { calculateXP } from "@/utils/types/battle/calculateXp";
import { PET_XP_MULTIPLIER } from "@/data/characters/petProgress";
import {
  rollEquipmentDrops,
  rollMaterialDrops,
  rollChestDrop,
  rollKeyDrop,
  rollPetGoat,
  rollNpcCardDrop,
} from "./useDrops";

export type { EquipmentDropInfo };

type Props = {
  npcClass: NPCClass;
  npcLevel: number;
  npcType: string;
  luckBonus: number;
};

export function useBattleRewards({
  npcClass,
  npcLevel,
  npcType,
  luckBonus,
}: Props) {
  const { player } = usePlayer();
  const { addXP, addCoins } = useCharacterProgress();
  const { addPetXP } = usePetProgress();
  const { getEquippedInfo, addDrop } = useEquipment();
  const { addItem } = useInventory();
  const { progressDailyWeekly } = useQuests();

  const xpReward = calculateXP(npcLevel, npcClass) ?? 0;
  const coinReward = (COIN_REWARDS[npcClass] ?? 0) * npcLevel;

  function giveSummonRewards(npcClass: NPCClass) {
    const xp = calculateXP(npcLevel, npcClass) ?? 0;
    const coins = (COIN_REWARDS[npcClass] ?? 0) * npcLevel;

    addXP(player.character, xp);
    addCoins(player.character, coins);

    const petInfo = getEquippedInfo(player.character, "pet");
    if (petInfo) {
      const petXpAmount = Math.floor(xp * PET_XP_MULTIPLIER);
      if (petXpAmount > 0) addPetXP(petInfo.id, petXpAmount);
    }
  }

  function giveRewards(): RewardInfo {
    addXP(player.character, xpReward);
    addCoins(player.character, coinReward);

    const petInfo = getEquippedInfo(player.character, "pet");
    if (petInfo) {
      const petXpAmount = Math.floor(xpReward * PET_XP_MULTIPLIER);
      if (petXpAmount > 0) addPetXP(petInfo.id, petXpAmount);
    }

    const equipmentDrops = rollEquipmentDrops(
      npcClass,
      addDrop,
      player.character,
      luckBonus,
    );

    const isLucky = Math.random() < luckBonus;
    if (isLucky) {
      const extraDrops = rollEquipmentDrops(
        npcClass,
        addDrop,
        player.character,
        0,
      );
      equipmentDrops.push(...extraDrops);
    }
    const itemDrops = rollMaterialDrops(npcClass, npcType, addItem);
    const chestDrop = rollChestDrop(
      npcClass,
      addItem,
      CHEST_DROP_CHANCE[npcClass],
    );
    const keyDrop = rollKeyDrop(npcClass, addItem, KEY_DROP_CHANCE[npcClass]);
    const petGoat = rollPetGoat(npcType, addDrop, player.character);

    if (itemDrops.length > 0) {
      progressDailyWeekly("collect_material", itemDrops.length);
      for (const drop of itemDrops) {
        if (drop.id === "hungry_essence")
          progressDailyWeekly("collect_hungry_essence", drop.qty);
        else if (drop.id === "goat_horn")
          progressDailyWeekly("collect_goat_horn", drop.qty);
      }
    }

    if (petGoat) equipmentDrops.push(petGoat);

    const cardDrop = rollNpcCardDrop(npcType, addItem);
    if (cardDrop) itemDrops.push(cardDrop);

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
