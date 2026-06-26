import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { CHARACTERS } from "@/utils/types/player/player";

export function usePlayerMenu(isOpen: boolean) {
  const { pushControls, popControls } = useGameControls();
  const { playMove, playSelect } = useMenuSFX();

  const [selectedCharIndex, setSelectedCharIndex] = useState(0);
  const selectedCharIndexRef = useRef(selectedCharIndex);

  useEffect(() => {
    selectedCharIndexRef.current = selectedCharIndex;
  }, [selectedCharIndex]);

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        playMoveRef.current();
        setSelectedCharIndex((prev) =>
          prev > 0 ? prev - 1 : CHARACTERS.length - 1,
        );
      },

      onDown: () => {
        playMoveRef.current();
        setSelectedCharIndex((prev) =>
          prev < CHARACTERS.length - 1 ? prev + 1 : 0,
        );
      },

      onLeft: () => {
        playMoveRef.current();
        setSelectedCharIndex((prev) =>
          prev > 0 ? prev - 1 : CHARACTERS.length - 1,
        );
      },

      onRight: () => {
        playMoveRef.current();
        setSelectedCharIndex((prev) =>
          prev < CHARACTERS.length - 1 ? prev + 1 : 0,
        );
      },

      onConfirm: () => {
        playSelectRef.current();
        return true;
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isOpen]);

  return {
    selectedChar: CHARACTERS[selectedCharIndex],
    charIds: CHARACTERS,
  };
}
