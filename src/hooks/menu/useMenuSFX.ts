import { useCallback } from "react";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useLatestRef } from "@/hooks/useLatestRef";

export function useMenuSFX() {
  const { playSound } = useSoundEffects();
  const playSoundRef = useLatestRef(playSound);

  const playMove = useCallback(
    () => playSoundRef.current("moveMenu"),
    [playSoundRef],
  );
  const playSelect = useCallback(
    () => playSoundRef.current("selectMenu"),
    [playSoundRef],
  );
  const playClose = useCallback(
    () => playSoundRef.current("closeMenu"),
    [playSoundRef],
  );

  return {
    playMove,
    playSelect,
    playClose,
  };
}
