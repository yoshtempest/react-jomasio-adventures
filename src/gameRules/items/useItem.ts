import { useNavigate } from "react-router";
import { usePlayer } from "@/contexts/PlayerContext";

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

export function useItemEffect({playSFX}: Props) {
  const navigate = useNavigate();
  const { setMode } = usePlayer();

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

      // case "peru": //
      //   return () => {
      //     playSFX?.("/assets/songs/transitions/openMap.mp3", 0.6);
      //     // changePlayerMovement()
      //   };

      default:
        return null;
    }
  }

  return { getEffect };
}