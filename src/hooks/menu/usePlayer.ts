import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { CHARACTERS } from "@/utils/types/player/player";

const SCROLL_AMOUNT = 60;
const TOTAL_ITEMS = CHARACTERS.length + 1; // Resumo + 12 characters

export function usePlayerMenu(
  isOpen: boolean,
  scrollRef?: React.RefObject<HTMLDivElement | null>,
  claimRewardRef?: React.RefObject<(index: number) => boolean>,
  rewardsCountRef?: React.RefObject<number>,
) {
  const { pushControls, popControls } = useGameControls();
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  const [subView, setSubView] = useState<"main" | "rewards">("main");
  const [selectedRewardIndex, setSelectedRewardIndex] = useState(0);
  const selectedRewardIndexRef = useRef(selectedRewardIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    selectedRewardIndexRef.current = selectedRewardIndex;
  }, [selectedRewardIndex]);

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

    if (subView === "rewards") {
      const controls = {
        onUp: () => {
          playMoveRef.current();
          const count = rewardsCountRef?.current ?? 0;
          if (count <= 0) return true;
          setSelectedRewardIndex((prev) => (prev > 0 ? prev - 1 : count - 1));
          return true;
        },

        onDown: () => {
          playMoveRef.current();
          const count = rewardsCountRef?.current ?? 0;
          if (count <= 0) return true;
          setSelectedRewardIndex((prev) => (prev < count - 1 ? prev + 1 : 0));
          return true;
        },

        onConfirm: () => {
          const claimed = claimRewardRef?.current(
            selectedRewardIndexRef.current,
          );
          if (claimed) playSelectRef.current();
          return true;
        },

        onCancel: () => {
          playSelectRef.current();
          setSubView("main");
          return true;
        },

        blockGlobalOpen: true,
      };

      pushControlsRef.current(controls);
      return () => popControlsRef.current();
    }

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
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : TOTAL_ITEMS - 1));
        return true;
      },

      onRight: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => (prev < TOTAL_ITEMS - 1 ? prev + 1 : 0));
        return true;
      },

      onConfirm: () => {
        playSelectRef.current();
        setSelectedRewardIndex(0);
        setSubView("rewards");
        return true;
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isOpen, subView, claimRewardRef, rewardsCountRef]);

  const isSummaryView = selectedIndex === 0;

  return {
    selectedIndex,
    isSummaryView,
    selectedChar: isSummaryView ? CHARACTERS[0] : CHARACTERS[selectedIndex - 1],
    charIds: CHARACTERS,
    subView,
    setSubView,
    selectedRewardIndex,
    setSelectedRewardIndex,
  };
}
