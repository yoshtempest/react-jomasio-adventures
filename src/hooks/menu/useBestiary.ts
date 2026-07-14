import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { BESTIARY_NPC_ORDER } from "@/data/bestiary";

export function useBestiaryMenu(
  isOpen: boolean,
  listRef?: React.RefObject<HTMLDivElement | null>,
) {
  const { pushControls, popControls } = useGameControls();
  const { playMove } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    if (!listRef?.current) return;

    const selectedElement = listRef.current.children[selectedIndex] as HTMLElement;
    if (!selectedElement) return;

    selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedIndex, listRef]);

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : BESTIARY_NPC_ORDER.length - 1,
        );
      },

      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          prev < BESTIARY_NPC_ORDER.length - 1 ? prev + 1 : 0,
        );
      },

      onConfirm: () => true,

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isOpen]);

  return {
    selectedIndex,
    npcIds: BESTIARY_NPC_ORDER,
  };
}
