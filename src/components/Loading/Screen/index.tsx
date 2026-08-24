import { useEffect } from "react";
import { asset } from "@/utils/paths";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

export function LoadingScreen() {
  const { playSound } = useSoundEffects();

  useEffect(() => {
    playSound("loading");
  }, [playSound]);

  return (
    <div className="loading-screen">
      <img className="loading-logo" src={asset("/assets/logo.svg")} />
    </div>
  );
}
