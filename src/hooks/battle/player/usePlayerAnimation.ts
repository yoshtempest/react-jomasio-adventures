import { useEffect } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import { animationFlow } from "@/data/battle/animationFlow";

const STUN_BASE_DURATION = 500;

export function usePlayerAnimation(
  player: Player,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  battleTenacityRef?: React.RefObject<number>,
  canRun?: boolean,
) {
  const tenacityRef = useLatestRef(battleTenacityRef);
  const canRunRef = useLatestRef(canRun);

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
      // Sono zerado: nunca chega em preRun/run (momento do run.svg).
      const wantsToRun =
        current.next === "preRun" || current.next === "run";
      if (wantsToRun && canRunRef != null && !canRunRef.current) return;

      setPlayer((p) => ({
        ...p,
        state: current.next,
      }));
    }, duration);

    return () => clearTimeout(timer);
  }, [player.state, setPlayer, tenacityRef, canRun, canRunRef]);
}
