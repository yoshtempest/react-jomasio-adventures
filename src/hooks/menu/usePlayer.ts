import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { CHARACTERS } from "@/utils/types/player/player";

const SCROLL_AMOUNT = 60;

export function usePlayerMenu(
  isOpen: boolean,
  scrollRef?: React.RefObject<HTMLDivElement | null>,
) {
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

  const doScroll = useRef((dy: number) => {
    scrollRef?.current?.scrollBy({ top: dy, behavior: "smooth" });
  });

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        doScroll.current(-SCROLL_AMOUNT);
        return true;
      },

      onDown: () => {
        doScroll.current(SCROLL_AMOUNT);
        return true;
      },

      onLeft: () => {
        playMoveRef.current();
        setSelectedCharIndex((prev) =>
          prev > 0 ? prev - 1 : CHARACTERS.length - 1,
        );
        return true;
      },

      onRight: () => {
        playMoveRef.current();
        setSelectedCharIndex((prev) =>
          prev < CHARACTERS.length - 1 ? prev + 1 : 0,
        );
        return true;
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
