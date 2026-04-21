import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";

const OPTIONS = ["hp", "strength", "intelligence"] as const;

export function useStatusMenu(isOpen: boolean) {
  const { pushControls, popControls } = useGameControls();
  const { addStat, progress } = useCharacterProgress();
  const { player } = usePlayer();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        setSelectedIndex((prev) =>
          prev === 0 ? OPTIONS.length - 1 : prev - 1
        );
      },

      onDown: () => {
        setSelectedIndex((prev) =>
          prev === OPTIONS.length - 1 ? 0 : prev + 1
        );
      },

      onConfirm: () => {
        const stat = OPTIONS[selectedIndexRef.current];
        const char = progress[player.character];

        if (char.stats.points <= 0) return true;

        addStat(player.character, stat);
        return true;
      },

      blockGlobalOpen: true,
    };

    pushControls(controls);
    return () => popControls();
  }, [isOpen, progress, player.character]);

  return {
    selectedIndex,
    options: OPTIONS,
  };
}