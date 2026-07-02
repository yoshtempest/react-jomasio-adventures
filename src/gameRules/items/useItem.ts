import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress, MAX_HUNGER } from "@/contexts/CharacterProgressContext";
import { useInventory } from "@/contexts/InventoryContext";
import { activateXpBuff, POTION_CONFIG } from "@/utils/buffs/xpBuff";

const FOOD_RESTORE: Record<string, number> = {
  queijo_cabra: 30,
  porcao_arroz: 20,
  ovo_piupiu: 25,
};

type Props = {
  playSFX?: (src: string, volume?: number) => void;
};

function rollEncounter() {
  const roll = Math.random() * 100;

  if (roll < 1) return "/battle/vandinhafragment";
  if (roll < 90) return "/battle/hungry";
  if (roll < 95) return "/battle/jhowsimar";
  return "/battle/goat";
}

export function useItemEffect({ playSFX }: Props) {
  const navigate = useNavigate();
  const { setMode, player, toggleHasPeru } = usePlayer();
  const { progress, restoreHunger } = useCharacterProgress();
  const { removeItem } = useInventory();

  function getEffect(itemId: string) {
    switch (itemId) {
      case "good_powder": // 🔥 Pó do bom
        return () => {
          playSFX?.("/assets/songs/transitions/undertaleToBattle.mp3", 0.6);
          const route = rollEncounter();
          navigate(route);
        };

      case "jorjao_map":
        return () => {
          playSFX?.("/assets/songs/transitions/openMap.mp3", 0.6);
          setMode("map"); // 🔥 entra no modo mapa
        };

      case "turkey":
        return () => {
          if (player.mode !== "explore") return;
          const isEquipping = !player.hasPeru;
          playSFX?.(
            isEquipping
              ? "/assets/songs/transitions/equip.mp3"
              : "/assets/songs/transitions/unequip.mp3",
            0.5,
          );
          toggleHasPeru();
        };

      case "xp_potion_common":
      case "xp_potion_rare":
      case "xp_potion_epic":
      case "xp_potion_boss":
      case "xp_potion_legendary":
        return () => {
          playSFX?.("/assets/songs/soundEffects/player/drinkingPotion.mp3", 0.6);
          const cfg = POTION_CONFIG[itemId];
          if (cfg) {
            activateXpBuff(cfg.durationMs, cfg.multiplier);
            removeItem(itemId as ItemId);
          }
        };

      default: {
        const restoreAmount = FOOD_RESTORE[itemId];
        if (restoreAmount) {
          return () => {
            if (progress[player.character].hunger >= MAX_HUNGER) return;
            playSFX?.("/assets/songs/soundEffects/player/eating.mp3", 0.6);
            restoreHunger(player.character, restoreAmount);
            removeItem(itemId as ItemId);
          };
        }
        return null;
      }
    }
  }

  return { getEffect };
}
