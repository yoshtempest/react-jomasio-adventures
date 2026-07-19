import { useRef, useState, useCallback, useEffect } from "react";
import { BATTLE_LIMITS } from "@/utils/types/player/movement";

type Props = {
  setPlayer: React.Dispatch<React.SetStateAction<Player>>;
  npcThrowAttackRef: React.RefObject<() => void>;
};

export function useGrabThrow({ setPlayer, npcThrowAttackRef }: Props) {
  const [isGrabbed, setIsGrabbed] = useState(false);
  const isGrabbedRef = useRef(false);
  isGrabbedRef.current = isGrabbed;

  const [grabFlipped, setGrabFlipped] = useState(false);
  const grabFlippedRef = useRef(false);
  grabFlippedRef.current = grabFlipped;

  const grabbedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isThrown, setIsThrown] = useState(false);

  const onGrabPlayer = useCallback(
    (flipped: boolean) => {
      setGrabFlipped(flipped);
      setIsGrabbed(true);
      setPlayer((p) => ({ ...p, grabbedUntil: Date.now() + 4000 }));
      if (grabbedTimerRef.current) clearTimeout(grabbedTimerRef.current);
      grabbedTimerRef.current = setTimeout(() => {
        setIsGrabbed(false);
        setGrabFlipped(false);
      }, 4000);
    },
    [setPlayer],
  );

  const onThrowStart = useCallback(
    (npcX: number, npcDirection: "left" | "right") => {
      setIsThrown(true);
      setPlayer((p) => {
        const dirAway = npcX > p.x ? -1 : 1;
        const throwToX = Math.max(
          BATTLE_LIMITS.minX,
          Math.min(BATTLE_LIMITS.maxX, p.x + dirAway * 300),
        );
        return {
          ...p,
          throwStartTime: Date.now(),
          throwFromX: p.x,
          throwToX,
          battleDirection: npcDirection,
          state: "fallen",
        };
      });
    },
    [setPlayer],
  );

  const onThrowPlayer = useCallback(() => {
    setIsGrabbed(false);
    npcThrowAttackRef.current();
  }, [npcThrowAttackRef]);

  useEffect(() => {
    return () => {
      if (grabbedTimerRef.current) clearTimeout(grabbedTimerRef.current);
    };
  }, []);

  return {
    isGrabbedRef,
    grabFlipped,
    grabFlippedRef,
    isThrown,
    setIsThrown,
    grabbedTimerRef,
    setIsGrabbed,
    onGrabPlayer,
    onThrowStart,
    onThrowPlayer,
  };
}
