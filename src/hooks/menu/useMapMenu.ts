import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";

export function useMapMenu() {
  const { pushControls, popControls } = useGameControls();
  const { setMode } = usePlayer();

  useEffect(() => {
    const controls = {
      onCancel: () => {
        setMode("explore");
      },
      blockGlobalOpen: true,
    };

    pushControls(controls);
    return () => popControls();
  }, []);
}