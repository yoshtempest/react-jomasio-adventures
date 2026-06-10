import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";

import { calculateXP } from "@/utils/calculateXp";

import { rollSlotDrop } from "@/data/equipment/drops";
import { EQUIPMENT_LIST } from "@/data/equipment";
import type { NPCClass } from "@/utils/types/npc/npcProgress";
import type { EquipmentSlot } from "@/utils/types/player/equipment";

type Props = {
  npcClass: NPCClass;
  npcLevel: number;
};

export const COIN_REWARDS: Record<string, number> = {
  common: 5,
  rare: 10,
  epic: 25,
  boss: 50,
  legendary: 100,
};

export function useBattleRewards({
  npcClass,
  npcLevel,
}: Props) {
  const { player, addCoins } = usePlayer();
  const { addXP } = useCharacterProgress();
  const { addDrop } = useEquipment();

  const xpReward = calculateXP(npcLevel, npcClass) ?? 0;
  const coinReward = (COIN_REWARDS[npcClass] ?? 0) * npcLevel;

  function giveSummonRewards(npcClass: NPCClass) {
    const xp = calculateXP(npcLevel, npcClass) ?? 0;
    const coins = (COIN_REWARDS[npcClass] ?? 0) * npcLevel;

    addXP(player.character, xp);
    addCoins(coins);
  }

  function giveRewards() {
    addXP(player.character, xpReward);
    addCoins(coinReward);

    const slots: EquipmentSlot[] = ["helmet", "chestplate", "pants", "boots"];

    for (const slot of slots) {
      const rank = rollSlotDrop(npcClass);
      if (!rank) continue;

      const equipment = EQUIPMENT_LIST.find(
        e => e.slot === slot && e.rank === rank
      );

      if (equipment) {
        addDrop(player.character, equipment.id);
      }
    }
  }

  return {
    xpReward,
    coinReward,
    giveRewards,
    giveSummonRewards
  };
}