import { useGameControlsLayer } from "@/hooks/useGameControlsLayer";

export function useVictoryKeyboard(isVisible: boolean, onContinue: () => void) {
  useGameControlsLayer(
    isVisible
      ? { onConfirm: onContinue, blockGlobalOpen: true }
      : null,
    [isVisible, onContinue],
  );
}
