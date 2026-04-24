// useClassSelection.ts
import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavigate } from "react-router";
import type { PlayerClass } from "@/utils/types/player/player";

const CLASSES: PlayerClass[] = ["fracote", "idiota", "amostradinho"];

export function useClassSelection(isActive: boolean) {
  const { pushControls, popControls } = useGameControls();
  const { chooseClass, setMode } = usePlayer();
  const navigate = useNavigate();

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
          prev === CLASSES.length - 1 ? 0 : prev + 1
        );
      },

      onLeft: () => {
        setSelectedIndex((prev) =>
          prev === 0 ? CLASSES.length - 1 : prev - 1
        );
      },

      onConfirm: () => {
        const selected = CLASSES[selectedIndexRef.current];
        chooseClass(selected);
        navigate("/pcroom/two");
        setMode("explore")
        return true;
      },

      blockGlobalOpen: true,
    };

    pushControls(controls);
    return () => popControls();
  }, [isActive]);

  return {
    classes: CLASSES,
    selectedIndex,
  };
}