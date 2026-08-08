import { useRef } from "react";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";

export function useVictoryKeyboard(isVisible: boolean, onContinue: () => void) {
  const onContinueRef = useRef(onContinue);
  onContinueRef.current = onContinue;

  useGameControlsLayer(
    isVisible
      ? {
          onConfirm: () => {
            onContinueRef.current();
            return true;
          },
          blockGlobalOpen: true,
        }
      : null,
    [isVisible],
  );
}
