import { useEffect } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { animationFlow } from "@/utils/types/battle/animationFlow";

const STUN_BASE_DURATION = 500;

export function usePlayerAnimation(
  player: Player,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  battleTenacityRef?: React.RefObject<number>,
) {
  const tenacityRef = useLatestRef(battleTenacityRef);

  useEffect(() => {
    if (player.state === "jump" || player.state === "falling") return;
    const current = animationFlow[player.state];

    if (!current) return;

    let duration = current.duration;
    if (player.state === "stun" && tenacityRef.current?.current != null) {
      duration = Math.round(
        STUN_BASE_DURATION * (1 - tenacityRef.current.current),
      );
    }

    const timer = setTimeout(() => {
      setPlayer((p) => ({
        ...p,
        state: current.next,
      }));
    }, duration);

    return () => clearTimeout(timer);
  }, [player.state, setPlayer, tenacityRef]);
}
