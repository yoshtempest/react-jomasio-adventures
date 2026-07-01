import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { CHARACTERS } from "@/utils/types/player/player";

const SCROLL_AMOUNT = 60;
const TOTAL_ITEMS = CHARACTERS.length + 1; // Resumo + 12 characters

export function usePlayerMenu(
  isOpen: boolean,
  scrollRef?: React.RefObject<HTMLDivElement | null>,
) {
  const { pushControls, popControls } = useGameControls();
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
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : TOTAL_ITEMS - 1,
        );
        return true;
      },

      onRight: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          prev < TOTAL_ITEMS - 1 ? prev + 1 : 0,
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

  const isSummaryView = selectedIndex === 0;

  return {
    selectedIndex,
    isSummaryView,
    selectedChar: isSummaryView ? CHARACTERS[0] : CHARACTERS[selectedIndex - 1],
    charIds: CHARACTERS,
  };
}
