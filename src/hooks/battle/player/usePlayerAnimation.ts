import { useEffect } from "react";
import { useLatestRef } from "@/hooks/useLatestRef";
import {
  animationFlow,
  getSpecialFlowOverride,
} from "@/data/battle/animationFlow";

const STUN_BASE_DURATION = 500;

export function usePlayerAnimation(
  player: Player,
  setPlayer: React.Dispatch<React.SetStateAction<Player>>,
  battleTenacityRef?: React.RefObject<number>,
  canRun?: boolean,
  timeScaleRef?: React.RefObject<number>,
) {
  const tenacityRef = useLatestRef(battleTenacityRef);
  const canRunRef = useLatestRef(canRun);
  const timeScaleInternalRef = useLatestRef(timeScaleRef);

  useEffect(() => {
    if (player.state === "jump" || player.state === "falling") return;

    const defaultStep = animationFlow[player.state];
    if (!defaultStep) return;

    const override = getSpecialFlowOverride(player.character);
    let step = defaultStep;

    if (override) {
      if (player.state === "preSpecial") {
        step = { ...defaultStep, ...override.preSpecial };
      } else if (player.state === "preSpecial2") {
        step = { ...defaultStep, ...override.preSpecial2 };
      }
    }

    let gameDuration = step.duration;
    if (player.state === "stun" && tenacityRef.current?.current != null) {
      gameDuration = Math.round(
        STUN_BASE_DURATION * (1 - tenacityRef.current.current),
      );
    }

    const scale = timeScaleInternalRef.current?.current ?? 1;
    const realDuration = Math.round(gameDuration / scale);

    const timer = setTimeout(() => {
      const wantsToRun =
        step.next === "preRun" || step.next === "run";
      if (wantsToRun && canRunRef != null && !canRunRef.current) return;

      setPlayer((p) => ({
        ...p,
        state: step.next,
      }));
    }, realDuration);

    return () => clearTimeout(timer);
  }, [player.state, player.character, setPlayer, tenacityRef, canRun, canRunRef, timeScaleInternalRef]);
}
