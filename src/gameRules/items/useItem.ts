import { useNavigate, useLocation } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavbar } from "@/contexts/NavbarContext";
import {
  useCharacterProgress,
  MAX_HUNGER,
} from "@/contexts/CharacterProgressContext";
import { useInventory } from "@/contexts/InventoryContext";
import { activateXpBuff, POTION_CONFIG } from "@/utils/buffs/xpBuff";

export const FOOD_RESTORE: Record<string, number> = {
  queijo_cabra: 30,
  porcao_arroz: 20,
  ovo_piupiu: 25,
};

type Props = {
  playSFX?: (src: string, volume?: number) => void;
};

const GOOD_POWDER_ENCOUNTERS = [
  { npcType: "vandinhaFragment", route: "/battle/vandinhafragment" },
  { npcType: "hungryDeath", route: "/battle/hungry" },
  { npcType: "jhowsimar", route: "/battle/jhowsimar" },
  { npcType: "goat", route: "/battle/goat" },
] as const;

function rollEncounter() {
  const roll = Math.random() * 100;

  if (roll < 1) return GOOD_POWDER_ENCOUNTERS[0];
  if (roll < 90) return GOOD_POWDER_ENCOUNTERS[1];
  if (roll < 95) return GOOD_POWDER_ENCOUNTERS[2];
  return GOOD_POWDER_ENCOUNTERS[3];
}

export function useItemEffect({ playSFX }: Props) {
  const navigate = useNavigate();
  const location = useLocation();
  const { setMode, player } = usePlayer();
  const { closeNavbar } = useNavbar();
  const { progress, restoreHunger } = useCharacterProgress();
  const { removeItem } = useInventory();

  function getEffect(itemId: ItemId) {
    switch (itemId) {
      case "good_powder": // 🔥 Pó do bom
        return () => {
          playSFX?.("/assets/songs/transitions/undertaleToBattle.mp3", 0.6);
          const encounter = rollEncounter();
          closeNavbar();
          setMode("select");
          navigate(location.pathname, {
            state: {
              ...(location.state ?? {}),
              goodPowderEncounter: encounter,
            },
          });
        };

      case "jorjao_map":
        return () => {
          playSFX?.("/assets/songs/transitions/openMap.mp3", 0.6);
          setMode("map"); // 🔥 entra no modo mapa
        };

      case "xp_potion_common":
      case "xp_potion_rare":
      case "xp_potion_epic":
      case "xp_potion_boss":
      case "xp_potion_legendary":
        return () => {
          playSFX?.(
            "/assets/songs/soundEffects/player/drinkingPotion.mp3",
            0.8,
          );
          const cfg = POTION_CONFIG[itemId];
          if (cfg) {
            activateXpBuff(cfg.durationMs, cfg.multiplier, itemId);
            removeItem(itemId);
          }
        };

      default: {
        const restoreAmount = FOOD_RESTORE[itemId];
        if (restoreAmount) {
          return () => {
            if (progress[player.character].hunger >= MAX_HUNGER) return;
            playSFX?.("/assets/songs/soundEffects/player/eating.mp3", 0.8);
            restoreHunger(player.character, restoreAmount);
            removeItem(itemId);
          };
        }
        return null;
      }
    }
  }

  return { getEffect };
}
