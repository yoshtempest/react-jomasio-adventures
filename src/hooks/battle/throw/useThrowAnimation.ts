import { useEffect, useRef } from "react";
import type { RefObject } from "react";

type Props = {
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  setIsThrown: React.Dispatch<React.SetStateAction<boolean>>;
  isMenuRef?: RefObject<boolean>;
};

export function useThrowAnimation({
  setPlayer,
  setIsThrown,
  isMenuRef,
}: Props) {
  const isMenuInternalRef = useRef(isMenuRef?.current ?? false);
  if (isMenuRef) isMenuInternalRef.current = isMenuRef.current;

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const interval = setInterval(() => {
      if (isMenuInternalRef.current) return;
      setPlayer((p) => {
        if (p.throwStartTime === 0) return p;

        const elapsed = Date.now() - p.throwStartTime;
        const duration = 2000;
        const progress = Math.min(elapsed / duration, 1);

        const x = p.throwFromX + (p.throwToX - p.throwFromX) * progress;

        const arcHeight = 100;
        const yOffset = -arcHeight * 4 * progress * (1 - progress);
        const y = p.groundY + yOffset;

        if (progress >= 1) {
          timeouts.push(
            setTimeout(
              () =>
                setPlayer((p2) => {
                  if (p2.state !== "fallen") return p2;
                  return { ...p2, state: "idleCrounched" };
                }),
              300,
            ),
            setTimeout(
              () =>
                setPlayer((p2) => {
                  if (p2.state !== "idleCrounched") return p2;
                  return { ...p2, state: "walkCrounched" };
                }),
              900,
            ),
            setTimeout(() => {
              setPlayer((p2) => {
                if (p2.state !== "walkCrounched") return p2;
                return {
                  ...p2,
                  state: "idle",
                  grabbedUntil: 0,
                  throwStartTime: 0,
                };
              });
              setIsThrown(false);
            }, 1800),
          );

          return {
            ...p,
            x,
            y: p.groundY,
            velY: 0,
            throwStartTime: 0,
            state: "fallen",
          };
        }

        return { ...p, x, y, velY: 0, state: "fallen" };
      });
    }, 16);

    return () => {
      clearInterval(interval);
      timeouts.forEach(clearTimeout);
    };
  }, [setPlayer, setIsThrown, isMenuRef]);
}
