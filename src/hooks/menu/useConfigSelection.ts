import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import type { NpcDifficulty } from "@/utils/types/npc/npcProgress";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";

const DIFFICULTY: NpcDifficulty[] = ["easy", "medium", "hard"];

export function useConfigSelection(isActive: boolean, onConfirm ?: () => void) {
  const { pushControls, popControls } = useGameControls();
  const { setDifficulty } = usePlayer();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    if (!isActive) return;

    const controls = {
      onRight: () => {
        setSelectedIndex((prev) =>
          circularNext(prev, DIFFICULTY.length)
        );
      },

      onLeft: () => {
        setSelectedIndex((prev) =>
          circularPrev(prev, DIFFICULTY.length)
        );
      },

      onConfirm: () => {
        const selected = getSelected(DIFFICULTY, selectedIndexRef.current);
        setDifficulty(selected);
        onConfirm?.();
        return true;
      },

      blockGlobalOpen: true,
    };

    pushControls(controls);
    return () => popControls();
  }, [isActive]);

  return {
    difficulty: DIFFICULTY,
    selectedIndex,
  };
}