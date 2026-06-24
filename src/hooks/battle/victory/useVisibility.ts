import { useEffect, useRef, useState } from "react";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

export function useVictoryVisibility(isOpen: boolean, skipDelay = false) {
  const { playSound } = useSoundEffects();
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;

  const hasPlayedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }

    if (skipDelay) {
      setIsVisible(true);
      return;
    }

    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isOpen, skipDelay]);

  useEffect(() => {
    if (isVisible && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      playSoundRef.current("win");
    }

    if (!isOpen) {
      hasPlayedRef.current = false;
    }
  }, [isVisible, isOpen]);

  return isVisible;
}
