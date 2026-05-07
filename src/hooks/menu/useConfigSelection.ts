import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import type { NpcDifficulty } from "@/utils/types/npc/npcProgress";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";
import { useAudio } from "@/contexts/AudioContext";

const DIFFICULTY: NpcDifficulty[] = ["easy", "medium", "hard"];

export function useConfigSelection(
  isActive: boolean,
  onConfirm?: () => void
) {
  const { pushControls, popControls } = useGameControls();

  const { setDifficulty } = usePlayer();
  const { volume, setVolume } = useAudio();

  const [selectedIndex, setSelectedIndex] = useState(0);

  // 0 = dificuldade
  // 1 = volume
  // 2 = tutorial
  const [selectedRow, setSelectedRow] = useState(0);

  // menu | tutorial
  const [screen, setScreen] = useState<"menu" | "tutorial">("menu");

  const selectedIndexRef = useRef(selectedIndex);
  const selectedRowRef = useRef(selectedRow);
  const screenRef = useRef(screen);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    selectedRowRef.current = selectedRow;
    screenRef.current = screen;
  }, [selectedIndex, selectedRow, screen]);

  useEffect(() => {
    if (!isActive) return;

    const controls = {
      onRight: () => {
        if (screenRef.current !== "menu") return;

        if (selectedRowRef.current === 0) {
          setSelectedIndex((prev) =>
            circularNext(prev, DIFFICULTY.length)
          );
        }

        if (selectedRowRef.current === 1) {
          setVolume(Math.min(volume + 10, 100));
        }
      },

      onLeft: () => {
        if (screenRef.current !== "menu") return;

        if (selectedRowRef.current === 0) {
          setSelectedIndex((prev) =>
            circularPrev(prev, DIFFICULTY.length)
          );
        }

        if (selectedRowRef.current === 1) {
          setVolume(Math.max(volume - 10, 0));
        }
      },

      onDown: () => {
        if (screenRef.current !== "menu") return;

        setSelectedRow((prev) => Math.min(prev + 1, 2));
      },

      onUp: () => {
        if (screenRef.current !== "menu") return;

        setSelectedRow((prev) => Math.max(prev - 1, 0));
      },

      onConfirm: () => {
        if (screenRef.current !== "menu") return true;

        // dificuldade
        if (selectedRowRef.current === 0) {
          const selected = getSelected(
            DIFFICULTY,
            selectedIndexRef.current
          );

          setDifficulty(selected);
        }

        // tutorial
        if (selectedRowRef.current === 2) {
          setScreen("tutorial");
        }

        onConfirm?.();

        return true;
      },

      onCancel: () => {
        if (screenRef.current === "tutorial") {
          setScreen("menu");
          return true;
        }

        return false;
      },

      blockGlobalOpen: true,
    };

    pushControls(controls);

    return () => popControls();
  }, [isActive, volume]);

  return {
    difficulty: DIFFICULTY,
    selectedIndex,
    selectedRow,
    screen,
  };
}