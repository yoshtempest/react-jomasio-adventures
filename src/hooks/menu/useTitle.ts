import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useTitles } from "@/contexts/TitleContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { TITLE_IDS } from "@/data/titles";

export function useTitleMenu(
  isOpen: boolean,
  listRef?: React.RefObject<HTMLDivElement | null>,
) {
  const { pushControls, popControls } = useGameControls();
  const { titlesData, equipTitle } = useTitles();
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // scroll suave automático
  useEffect(() => {
    if (!listRef?.current) return;

    const container = listRef.current;
    const selectedElement = container.children[selectedIndex] as HTMLElement;
    if (!selectedElement) return;

    container.scrollTo({
      top: selectedElement.offsetTop - container.offsetTop,
      behavior: "smooth",
    });
  }, [selectedIndex, listRef]);

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;
  const equipTitleRef = useRef(equipTitle);
  equipTitleRef.current = equipTitle;

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : TITLE_IDS.length - 1,
        );
      },

      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          prev < TITLE_IDS.length - 1 ? prev + 1 : 0,
        );
      },

      onConfirm: () => {
        const id = TITLE_IDS[selectedIndexRef.current];
        const prog = titlesData.progress[id];
        if (!prog || prog.level === 0) return true;

        playSelectRef.current();
        equipTitleRef.current(id);
        return true;
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isOpen, titlesData.progress]);

  return {
    selectedIndex,
    titleIds: TITLE_IDS,
    equippedId: titlesData.equippedId,
  };
}
