import { useState, useRef, useCallback } from "react";
import { BATTLE_LIMITS } from "@/utils/types/player/movement";

export function useGrabThrowState() {
  const [isGrabbed, setIsGrabbed] = useState(false);
  const isGrabbedRef = useRef(false);
  isGrabbedRef.current = isGrabbed;

  const [grabFlipped, setGrabFlipped] = useState(false);
  const grabFlippedRef = useRef(false);
  grabFlippedRef.current = grabFlipped;

  const grabbedTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isThrown, setIsThrown] = useState(false);

  const grabPlayer = useCallback(
    (
      flipped: boolean,
      setPlayer: React.Dispatch<React.SetStateAction<Player>>,
    ) => {
      setGrabFlipped(flipped);
      setIsGrabbed(true);
      setPlayer((p) => ({ ...p, grabbedUntil: Date.now() + 4000 }));
      if (grabbedTimerRef.current) clearTimeout(grabbedTimerRef.current);
      grabbedTimerRef.current = setTimeout(() => {
        setIsGrabbed(false);
        setGrabFlipped(false);
      }, 4000);
    },
    [],
  );

  const throwStart = useCallback(
    (
      npcX: number,
      npcDirection: "left" | "right",
      setPlayer: React.Dispatch<React.SetStateAction<Player>>,
    ) => {
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
    [],
  );

  const throwEnd = useCallback(() => {
    setIsGrabbed(false);
  }, []);

  const cleanup = useCallback(() => {
    if (grabbedTimerRef.current) clearTimeout(grabbedTimerRef.current);
    grabbedTimerRef.current = null;
    setIsGrabbed(false);
  }, []);

  const reset = useCallback(() => {
    if (grabbedTimerRef.current) clearTimeout(grabbedTimerRef.current);
    grabbedTimerRef.current = null;
    setIsGrabbed(false);
  }, []);

  return {
    isGrabbed,
    isGrabbedRef,
    grabFlipped,
    grabFlippedRef,
    isThrown,
    setIsThrown,
    grabPlayer,
    throwStart,
    throwEnd,
    cleanup,
    reset,
  };
}
