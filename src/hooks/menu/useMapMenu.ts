import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";

export function useMapMenu() {
  const { pushControls, popControls } = useGameControls();
  const { setMode } = usePlayer();
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;

  useEffect(() => {
    const controls = {
      onCancel: () => {
        setModeRef.current("explore");
        return true;
      },
      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, []);
}