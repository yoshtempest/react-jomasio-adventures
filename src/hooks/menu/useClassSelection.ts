import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayerActions } from "@/contexts/PlayerContext";
import { useFlags } from "@/contexts/FlagContext";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";
import { asset } from "@/utils/paths";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

const CLASSES: PlayerClass[] = ["fracote", "idiota", "amostradinho"];

export function useClassSelection(isActive: boolean, onConfirm?: () => void) {
  const { pushControls } = useGameControls();
  const { chooseClass } = usePlayerActions();
  const { setFlag } = useFlags();
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const playMoveRef = useLatestRef(playMove);
  const playSelectRef = useLatestRef(playSelect);
  const pushControlsRef = useLatestRef(pushControls);
  const chooseClassRef = useLatestRef(chooseClass);
  const setFlagRef = useLatestRef(setFlag);
  const onConfirmRef = useLatestRef(onConfirm);

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
        setFlagRef.current("chose_class");
        onConfirmRef.current?.(); // 👈 aqui está a mágica
        return true;
      },

      blockGlobalOpen: true,
    };

    const remove = pushControlsRef.current(controls);
    return () => remove();
  }, [
    isActive,
    chooseClassRef,
    onConfirmRef,
    playMoveRef,
    playSelectRef,
    pushControlsRef,
    setFlagRef,
  ]);

  return {
    classes: CLASSES,
    selectedIndex,
  };
}
