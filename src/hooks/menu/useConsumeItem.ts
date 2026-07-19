import { useRef } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress, MAX_HUNGER } from "@/contexts/CharacterProgressContext";
import { useAudio } from "@/contexts/AudioContext";
import { sfx } from "@/utils/paths";
import { activateXpBuff, POTION_CONFIG } from "@/utils/buffs/xpBuff";
import { FOOD_RESTORE } from "@/gameRules/items/useItem";

export function useConsumeItem() {
  const { removeItem } = useInventory();
  const { player } = usePlayer();
  const { progress, restoreHunger } = useCharacterProgress();
  const { sfxVolume } = useAudio();

  const sfxVolumeRef = useRef(sfxVolume);
  sfxVolumeRef.current = sfxVolume;

  const consumeItemRef = useRef<(id: string) => void>(() => {});
  consumeItemRef.current = function consumeItem(id: string) {
    const foodAmount = FOOD_RESTORE[id];
    if (foodAmount) {
      const currentHunger = progress[player.character]?.hunger ?? 0;
      if (currentHunger >= MAX_HUNGER) return;
      restoreHunger(player.character, foodAmount);
    }

    const audio = sfx("/player/drinkingPotion.mp3");
    audio.volume = 0.6 * (sfxVolumeRef.current / 100);
    audio.play().catch(() => {});
    const cfg = POTION_CONFIG[id];
    if (cfg) {
      activateXpBuff(cfg.durationMs, cfg.multiplier, id);
    }
    removeItem(id as ItemId);
  };

  return { consumeItemRef };
}
