import { useEffect } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import type { GameControlLayer } from "@/utils/types/player/controls";

export function useGameControlsLayer(
  controls: GameControlLayer | null,
  deps: React.DependencyList,
) {
  const { pushControls, popControls } = useGameControls();

  useEffect(() => {
    if (!controls) return;
    pushControls(controls);
    return () => popControls();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}
