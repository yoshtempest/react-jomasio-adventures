import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import type { PlayerClass } from "@/utils/types/player/player";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";
import { asset } from "@/utils/asset";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

const CLASSES: PlayerClass[] = ["fracote", "idiota", "amostradinho"];

export function useClassSelection(isActive: boolean, onConfirm?: () => void) {
  const { pushControls, popControls } = useGameControls();
  const { chooseClass } = usePlayer();
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;
  const chooseClassRef = useRef(chooseClass);
  chooseClassRef.current = chooseClass;
  const onConfirmRef = useRef(onConfirm);
  onConfirmRef.current = onConfirm;

  useEffect(() => {
    if (!isActive) return;

    const controls = {
      onRight: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => circularNext(prev, CLASSES.length));
      },

      onLeft: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => circularPrev(prev, CLASSES.length));
      },

      onConfirm: () => {
        playSelectRef.current();
        const selected = getSelected(CLASSES, selectedIndexRef.current);
        if (selected === "amostradinho") {
          const audio = new Audio(
            asset(
              "/assets/songs/soundEffects/player/ifClassIsAmostradinho.mp3",
            ),
          );
          audio.play().catch(() => {});
        }
        chooseClassRef.current(selected);
        onConfirmRef.current?.(); // 👈 aqui está a mágica
        return true;
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isActive]);

  return {
    classes: CLASSES,
    selectedIndex,
  };
}
