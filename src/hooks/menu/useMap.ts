import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";

export function useMapMenu() {
  const { pushControls } = useGameControls();
  const { setMode } = usePlayer();
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;

  useEffect(() => {
    const controls = {
      onConfirm: () => true,
      onUp: () => true,
      onDown: () => true,
      onLeft: () => true,
      onRight: () => true,
      onCancel: () => {
        setModeRef.current("explore");
        return true;
      },
      blockGlobalOpen: true,
    };

    const remove = pushControlsRef.current(controls);
    return () => remove();
  }, []);
}
