import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import type { PlayerClass } from "@/utils/types/player/player";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";
import { asset } from "@/utils/asset";

const CLASSES: PlayerClass[] = ["fracote", "idiota", "amostradinho"];

export function useClassSelection(isActive: boolean, onConfirm ?: () => void) {
  const { pushControls, popControls } = useGameControls();
  const { chooseClass } = usePlayer();

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
          circularNext(prev, CLASSES.length)
        );
      },

      onLeft: () => {
        setSelectedIndex((prev) =>
          circularPrev(prev, CLASSES.length)
        );
      },

      onConfirm: () => {
        const selected = getSelected(CLASSES, selectedIndexRef.current);
        if (selected === "amostradinho") {
          const audio = new Audio(asset("/assets/songs/soundEffects/player/ifClassIsAmostradinho.mp3"));
          audio.play().catch(() => {});
        }
        chooseClass(selected);
        onConfirm?.(); // 👈 aqui está a mágica
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