import { useEffect } from "react";
import { animationFlow } from "@/utils/animationFlow";
import type { Player } from "@/utils/types/player/player";

export function usePlayerAnimation(
    player: Player,
    setPlayer: React.Dispatch<React.SetStateAction<Player>>
) {
  useEffect(() => {
    if (player.state === "jump") return;
    const current = animationFlow[player.state];

    if (!current) return;

    const timer = setTimeout(() => {
      setPlayer((p) => ({
        ...p,
        state: current.next,
      }));
    }, current.duration);

    return () => clearTimeout(timer);
  }, [player.state, setPlayer]);
}