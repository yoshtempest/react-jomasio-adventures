import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import type { NpcDifficulty } from "@/utils/types/npc/npcProgress";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";
import { useAudio } from "@/contexts/AudioContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

const DIFFICULTY: NpcDifficulty[] = ["easy", "medium", "hard"];

export function useConfigSelection(
  isActive: boolean,
  onConfirm?: () => void
) {
  const { pushControls, popControls } = useGameControls();

  const { setDifficulty } = usePlayer();
  const { volume, setVolume } = useAudio();
  const { playMove, playSelect, playClose } = useMenuSFX();

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

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const playCloseRef = useRef(playClose);
  playCloseRef.current = playClose;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;
  const setDifficultyRef = useRef(setDifficulty);
  setDifficultyRef.current = setDifficulty;
  const setVolumeRef = useRef(setVolume);
  setVolumeRef.current = setVolume;
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;

  useEffect(() => {
    if (!isActive) return;

    const controls = {
      onRight: () => {
        if (screenRef.current !== "menu") return;
        playMoveRef.current();

        if (selectedRowRef.current === 0) {
          setSelectedIndex((prev) =>
            circularNext(prev, DIFFICULTY.length)
          );
        }

        if (selectedRowRef.current === 1) {
          setVolumeRef.current(Math.min(volume + 10, 100));
        }
      },

      onLeft: () => {
        if (screenRef.current !== "menu") return;
        playMoveRef.current();

        if (selectedRowRef.current === 0) {
          setSelectedIndex((prev) =>
            circularPrev(prev, DIFFICULTY.length)
          );
        }

        if (selectedRowRef.current === 1) {
          setVolumeRef.current(Math.max(volume - 10, 0));
        }
      },

      onDown: () => {
        if (screenRef.current !== "menu") return;

        playMoveRef.current();
        setSelectedRow((prev) => Math.min(prev + 1, 2));
      },

      onUp: () => {
        if (screenRef.current !== "menu") return;

        playMoveRef.current();
        setSelectedRow((prev) => Math.max(prev - 1, 0));
      },

      onConfirm: () => {
        if (screenRef.current !== "menu") return true;

        playSelectRef.current();

        // dificuldade
        if (selectedRowRef.current === 0) {
          const selected = getSelected(
            DIFFICULTY,
            selectedIndexRef.current
          );

          setDifficultyRef.current(selected);
        }

        // tutorial
        if (selectedRowRef.current === 2) {
          setScreen("tutorial");
        }

        onConfirmRef.current?.();

        return true;
      },

      onCancel: () => {
        playCloseRef.current();
        if (screenRef.current === "tutorial") {
          setScreen("menu");
          return true;
        }

        return false;
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);

    return () => popControlsRef.current();
  }, [isActive, volume]);

  return {
    difficulty: DIFFICULTY,
    selectedIndex,
    selectedRow,
    screen,
  };
}