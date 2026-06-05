import { useEffect } from "react";
import { asset } from "@/utils/asset";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

export function LoadingScreen() {
  const { playSound } = useSoundEffects();

  useEffect(() => {
    playSound("loading");
  }, []);

  return (
    <div className="loading-screen">
      <img
        className="loading-logo"
        src={asset("/assets/logo.svg")}
      />
    </div>
  );
}