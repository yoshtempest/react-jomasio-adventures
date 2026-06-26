import { useState, useEffect } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";

export function useBattleIntro() {
  const [showIntro, setShowIntro] = useState(true);
  const { pushControls, popControls } = useGameControls();

  useEffect(() => {
    const timeout = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!showIntro) return;
    pushControls({
      onConfirm: () => {
        setShowIntro(false);
        return true;
      },
    });
    return () => popControls();
  }, [showIntro, pushControls, popControls]);

  function skipIntro() {
    setShowIntro(false);
  }

  return { showIntro, skipIntro };
}
