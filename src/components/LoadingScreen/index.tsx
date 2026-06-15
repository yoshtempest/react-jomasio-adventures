import { useEffect, useRef } from "react";
import { asset } from "@/utils/asset";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

export function LoadingScreen() {
  const { playSound } = useSoundEffects();
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;

  useEffect(() => {
    playSoundRef.current("loading");
  }, []);

  return (
    <div className="loading-screen">
      <img className="loading-logo" src={asset("/assets/logo.svg")} />
    </div>
  );
}
