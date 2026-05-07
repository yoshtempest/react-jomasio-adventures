import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import type { NpcDifficulty } from "@/utils/types/npc/npcProgress";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";
import { useAudio } from "@/contexts/AudioContext";

const DIFFICULTY: NpcDifficulty[] = ["easy", "medium", "hard"];

export function useConfigSelection(isActive: boolean, onConfirm ?: () => void) {
  const { pushControls, popControls } = useGameControls();
  const { setDifficulty } = usePlayer();
  const { volume, setVolume } = useAudio();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [selectedRow, setSelectedRow] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    if (!isActive) return;

    const controls = {
      onRight: () => {
        if (selectedRow === 0) {
          setSelectedIndex((prev) =>
            circularNext(prev, DIFFICULTY.length)
          );
        }

        if (selectedRow === 1) {
          setVolume(Math.min(volume + 10, 100));
        }
      },

      onLeft: () => {
        if (selectedRow === 0) {
          setSelectedIndex((prev) =>
            circularPrev(prev, DIFFICULTY.length)
          );
        }

        if (selectedRow === 1) {
          setVolume(Math.max(volume - 10, 0));
        }
      },

      onDown: () => {
        setSelectedRow(1);
      },

      onUp: () => {
        setSelectedRow(0);
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
    selectedRow,
  };
}