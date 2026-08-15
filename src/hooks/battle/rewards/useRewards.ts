import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePetProgress } from "@/contexts/PetProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useInventory } from "@/contexts/InventoryContext";
import { useQuests } from "@/contexts/QuestContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useFlags } from "@/contexts/FlagContext";
import {
  COIN_REWARDS,
  CHEST_DROP_CHANCE,
  KEY_DROP_CHANCE,
} from "@/data/battle/drops";
import { calculateXP } from "@/utils/types/battle/calculateXp";
import {
  PET_XP_MULTIPLIER,
  petStarsFromEnhance,
} from "@/data/characters/petProgress";
import {
  getUnlockedCharacters,
  distributeSharedXp,
} from "@/gameRules/rewards/sharedXp";
import {
  rollEquipmentDrops,
  rollMaterialDrops,
  rollChestDrop,
  rollKeyDrop,
  rollPetDrop,
  rollNpcCardDrop,
} from "./useDrops";

function rollMultiple<T>(rollFn: () => T, rolls: number): T[] {
  const results: T[] = [];
  for (let i = 0; i < rolls; i++) {
    results.push(rollFn());
  }
  return results;
}

export type { EquipmentDropInfo };

type Props = {
  npcClass: NPCClass;
  npcLevel: number;
  npcType: string;
  luckBonus: number;
  isAlfa?: boolean;
};

export function useBattleRewards({
  npcClass,
  npcLevel,
  npcType,
  luckBonus,
  isAlfa = false,
}: Props) {
  const { player } = usePlayer();
  const { addXP, addCoins } = useCharacterProgress();
  const { addPetXP } = usePetProgress();
  const { getEquippedInfo, addDrop } = useEquipment();
  const { addItem } = useInventory();
  const { progressDailyWeekly } = useQuests();
  const { sharedXp } = useSettings();
  const { hasFlag } = useFlags();

  const xpReward =
    (calculateXP(npcLevel, npcClass) ?? 0) * (isAlfa ? 3 : 1);
  const coinReward = (COIN_REWARDS[npcClass] ?? 0) * npcLevel;
  const dropRolls = isAlfa ? 2 : 1;

  function collectEquipmentDrops() {
    const equipmentDrops: EquipmentDropInfo[] = rollMultiple(
      () =>
        rollEquipmentDrops(npcClass, addDrop, player.character, luckBonus),
      dropRolls,
    ).flat();

    if (Math.random() < luckBonus) {
      equipmentDrops.push(
        ...rollEquipmentDrops(npcClass, addDrop, player.character, 0),
      );
    }

    return equipmentDrops;
  }

  function collectMaterialDrops() {
    const itemDrops: ItemDropInfo[] = [];

    for (const drop of rollMultiple(
      () => rollMaterialDrops(npcClass, npcType, addItem),
      dropRolls,
    ).flat()) {
      const existing = itemDrops.find((d) => d.id === drop.id);
      if (existing) {
        existing.qty += drop.qty;
      } else {
        itemDrops.push({ ...drop });
      }
    }

    return itemDrops;
  }

  function collectChestAndKeyDrops() {
    let chestDrop: { id: string; name: string } | null = null;
    let keyDrop: { id: string; name: string } | null = null;

    rollMultiple(() => {
      if (!chestDrop) {
        chestDrop = rollChestDrop(
          npcClass,
          addItem,
          CHEST_DROP_CHANCE[npcClass],
        );
      }
      if (!keyDrop) {
        keyDrop = rollKeyDrop(npcClass, addItem, KEY_DROP_CHANCE[npcClass]);
      }
      return null;
    }, dropRolls);

    return { chestDrop, keyDrop };
  }

  function collectPetDrop() {
    let petDrop: EquipmentDropInfo | null = null;

    rollMultiple(() => {
      if (!petDrop) petDrop = rollPetDrop(npcType, addDrop, player.character);
      return petDrop;
    }, dropRolls);

    return petDrop;
  }

  function collectCardDrop() {
    let cardDrop: ItemDropInfo | null = null;

    rollMultiple(() => {
      if (!cardDrop) cardDrop = rollNpcCardDrop(npcType, addItem);
      return cardDrop;
    }, dropRolls);

    return cardDrop;
  }

  function giveRewards(): RewardInfo {
    giveXp(xpReward);
    addCoins(player.character, coinReward);

    const petInfo = getEquippedInfo(player.character, "pet");
    if (petInfo) {
      const petXpAmount = Math.floor(xpReward * PET_XP_MULTIPLIER);
      if (petXpAmount > 0)
        addPetXP(petInfo.id, petStarsFromEnhance(petInfo.enhance), petXpAmount);
    }

    const equipmentDrops = collectEquipmentDrops();
    const itemDrops = collectMaterialDrops();
    const { chestDrop, keyDrop } = collectChestAndKeyDrops();

    if (itemDrops.length > 0) {
      progressDailyWeekly("collect_material", itemDrops.length);
      for (const drop of itemDrops) {
        if (drop.id === "hungry_essence")
          progressDailyWeekly("collect_hungry_essence", drop.qty);
        else if (drop.id === "goat_horn")
          progressDailyWeekly("collect_goat_horn", drop.qty);
      }
    }

    const petDrop = collectPetDrop();
    if (petDrop) equipmentDrops.push(petDrop);

    const cardDrop = collectCardDrop();
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

  function giveSummonRewards(npcClass: NPCClass) {
    const xp = calculateXP(npcLevel, npcClass) ?? 0;
    const coins = (COIN_REWARDS[npcClass] ?? 0) * npcLevel;

    addXP(player.character, xp);
    addCoins(player.character, coins);

    const petInfo = getEquippedInfo(player.character, "pet");
    if (petInfo) {
      const petXpAmount = Math.floor(xp * PET_XP_MULTIPLIER);
      if (petXpAmount > 0)
        addPetXP(petInfo.id, petStarsFromEnhance(petInfo.enhance), petXpAmount);
    }
  }

  function giveXp(amount: number) {
    if (sharedXp) {
      const unlocked = getUnlockedCharacters(hasFlag);
      const distribution = distributeSharedXp(amount, player.character, unlocked);
      for (const [character, xp] of Object.entries(distribution)) {
        if (xp > 0) addXP(character as CharacterId, xp);
      }
      return;
    }

    addXP(player.character, amount);
  }

  return {
    xpReward,
    coinReward,
    giveRewards,
    giveSummonRewards,
  };
}
