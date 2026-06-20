import { useEffect } from "react";

export function useVictoryKeyboard(isVisible: boolean, onContinue: () => void) {
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "enter" || key === "l" || key === "a") {
        onContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isVisible, onContinue]);
}
