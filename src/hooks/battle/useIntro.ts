import { useState, useEffect } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";

export function useBattleIntro() {
  const [showIntro, setShowIntro] = useState(true);
  const { pushControls } = useGameControls();

  useEffect(() => {
    const timeout = setTimeout(() => setShowIntro(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!showIntro) return;
    const remove = pushControls({
      onConfirm: () => {
        setShowIntro(false);
        return true;
      },
    });
    return remove;
  }, [showIntro, pushControls]);

  function skipIntro() {
    setShowIntro(false);
  }

  return { showIntro, skipIntro };
}
