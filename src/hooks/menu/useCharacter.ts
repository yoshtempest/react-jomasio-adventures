import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { CHARACTERS } from "@/data/options/characters";
import {
  circularNext,
  circularPrev,
  gridMove,
} from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useFlags } from "@/contexts/FlagContext";
import { usePlayTime } from "@/contexts/PlayTimeContext";
import { getUnlockDate } from "@/utils/character/unlockDate";

export function useCharacterMenu(
  isOpen: boolean,
  listRef?: React.RefObject<HTMLDivElement | null>,
) {
  const { setCharacter } = usePlayer();
  const { pushControls } = useGameControls();
  const { playMove, playSelect } = useMenuSFX();
  const { hasFlag } = useFlags();
  const { firstLoginDate } = usePlayTime();

  const selectableCharacters = CHARACTERS.filter(
    (c) =>
      c.selectable ||
      (c.image === "samuel" && hasFlag("samurionUnlocked")) ||
      (c.image === "lucas" && hasFlag("yvelUnlocked")) ||
      (c.image === "artur" && hasFlag("srGuaxinimUnlocked")),
  );

  const characters = CHARACTERS.map((c) => ({
    ...c,
    selectable:
      c.selectable ||
      (c.image === "samuel" && hasFlag("samurionUnlocked")) ||
      (c.image === "lucas" && hasFlag("yvelUnlocked")) ||
      (c.image === "artur" && hasFlag("srGuaxinimUnlocked")),
    unlockedDate: c.selectable
      ? firstLoginDate || null
      : getUnlockDate(c.image),
  }));

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const handleChooseCharacterRef = useRef<(id: CharacterId) => void>(() => {});
  handleChooseCharacterRef.current = (id: CharacterId) => setCharacter(id);
  const playMoveRef = useLatestRef(playMove);
  const playSelectRef = useLatestRef(playSelect);
  const pushControlsRef = useLatestRef(pushControls);
  const selectableCharactersRef = useLatestRef(selectableCharacters);

  // 🎮 CONTROLES
  useEffect(() => {
    const controls = {
      onRight: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          circularNext(prev, selectableCharactersRef.current.length),
        );
      },

      onLeft: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          circularPrev(prev, selectableCharactersRef.current.length),
        );
      },

      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          gridMove(prev, 2, "down", selectableCharactersRef.current.length),
        );
      },

      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          gridMove(prev, 2, "up", selectableCharactersRef.current.length),
        );
      },

      onConfirm: () => {
        playSelectRef.current();
        const selected = getSelected(
          selectableCharactersRef.current,
          selectedIndexRef.current,
        );
        handleChooseCharacterRef.current(selected.image as CharacterId);
        return true;
      },

      blockGlobalOpen: true,
    };

    const remove = pushControlsRef.current(controls);
    return () => remove();
  }, [playMoveRef, playSelectRef, pushControlsRef, selectableCharactersRef]);

  useEffect(() => {
    if (!isOpen || !listRef?.current) return;
    const container = listRef.current;
    const selectedElement = container.children[selectedIndex] as HTMLElement;
    if (!selectedElement) return;
    selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [isOpen, selectedIndex, listRef]);

  return {
    characters,
    selectableCharacters,
    selectedIndex,
  };
}
