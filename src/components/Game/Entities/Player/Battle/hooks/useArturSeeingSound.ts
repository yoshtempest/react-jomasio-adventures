import { useEffect, useRef } from "react";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { playerPath } from "@/utils/paths";


export function useArturSeeingSound(src: string) {
  const { playSound } = useSoundEffects();
  const prePalmPlayedRef = useRef(false);
  const ARTUR_SEEING_SRC = playerPath("/artur/inFight/special/arturSeeing.svg");

  useEffect(() => {
    if (src === ARTUR_SEEING_SRC) {
      if (!prePalmPlayedRef.current) {
        playSound("prePalm");
      }

      prePalmPlayedRef.current = true;
    } else {
      prePalmPlayedRef.current = false;
    }
  }, [src, playSound, ARTUR_SEEING_SRC]);
}