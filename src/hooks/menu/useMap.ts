import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useLatestRef } from "@/hooks/useLatestRef";

export function useMapMenu() {
  const { pushControls } = useGameControls();
  const { setMode } = usePlayer();
  const pushControlsRef = useLatestRef(pushControls);
  const setModeRef = useLatestRef(setMode);

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
  }, [pushControlsRef, setModeRef]);
}
