import { useEffect, useState, useCallback } from "react";
import type { RefObject, Dispatch, SetStateAction } from "react";

import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useFlags } from "@/contexts/FlagContext";
import { CHARACTERS } from "@/data/options/characters";
import {
  gridMove,
  circularNext,
  circularPrev,
} from "@/gameRules/menu/navigation";

const CHAR_UNLOCK_FLAGS: Record<string, FlagId> = {
  samuel: "samurionUnlocked",
  artur: "srGuaxinimUnlocked",
  emanuel: "ematronUnlocked",
  larissa: "laricellUnlocked",
  mayra: "yraUnlocked",
  camilly: "kamykazeUnlocked",
  lucas: "yvelUnlocked",
  lucaua: "babidiUnlocked",
  riquelme: "natsukiUnlocked",
};

export type DefeatMenuSelection = "retry" | "flee" | "characterSelect";
type View = "menu" | "characterSelect";

const DEFEAT_MENU_NEXT: Record<DefeatMenuSelection, DefeatMenuSelection> = {
  retry: "flee",
  flee: "characterSelect",
  characterSelect: "retry",
};

const DEFEAT_MENU_PREV: Record<DefeatMenuSelection, DefeatMenuSelection> = {
  retry: "characterSelect",
  characterSelect: "flee",
  flee: "retry",
};

function menuCycleHandler(
  viewRef: RefObject<View>,
  playMoveRef: RefObject<() => void>,
  setMenuSelectionRef: RefObject<Dispatch<SetStateAction<DefeatMenuSelection>>>,
  table: Record<DefeatMenuSelection, DefeatMenuSelection>,
) {
  return () => {
    if (viewRef.current !== "menu") return;
    playMoveRef.current();
    setMenuSelectionRef.current((prev) => table[prev]);
  };
}

export function useDefeatCharacterSelect(isOpen: boolean) {
  const { player, setCharacter } = usePlayer();
  const { hasFlag } = useFlags();
  const { playMove, playSelect } = useMenuSFX();
  const { pushControls } = useGameControls();

  const unlockedCharacters = CHARACTERS.filter((c) => {
    const unlockFlag = CHAR_UNLOCK_FLAGS[c.image];
    return c.selectable || (unlockFlag !== undefined && hasFlag(unlockFlag));
  });

  const [menuSelection, setMenuSelection] =
    useState<DefeatMenuSelection>("retry");
  const [charIndex, setCharIndex] = useState(0);
  const [view, setView] = useState<View>("menu");

  const menuSelectionRef = useLatestRef(menuSelection);
  const charIndexRef = useLatestRef(charIndex);
  const viewRef = useLatestRef(view);
  const unlockedRef = useLatestRef(unlockedCharacters);
  const setCharacterRef = useLatestRef(setCharacter);
  const playMoveRef = useLatestRef(playMove);
  const playSelectRef = useLatestRef(playSelect);
  const setMenuSelectionRef = useLatestRef(setMenuSelection);
  const setCharIndexRef = useLatestRef(setCharIndex);
  const setViewRef = useLatestRef(setView);

  const selectCharNext = useCallback(() => {
    playMoveRef.current();
    setCharIndexRef.current((prev) =>
      circularNext(prev, unlockedRef.current.length),
    );
  }, [playMoveRef, setCharIndexRef, unlockedRef]);

  const selectCharPrev = useCallback(() => {
    playMoveRef.current();
    setCharIndexRef.current((prev) =>
      circularPrev(prev, unlockedRef.current.length),
    );
  }, [playMoveRef, setCharIndexRef, unlockedRef]);

  const openCharacterSelect = useCallback(() => {
    const idx = unlockedRef.current.findIndex(
      (c) => c.image === player.character,
    );
    setCharIndexRef.current(idx >= 0 ? idx : 0);
    setViewRef.current("characterSelect");
    pushControls({
      onLeft: selectCharPrev,
      onRight: selectCharNext,
      onUp: () => {
        playMoveRef.current();
        setViewRef.current("menu");
        return true;
      },
      onDown: () => {
        playMoveRef.current();
        setCharIndexRef.current((prev) =>
          gridMove(prev, 2, "down", unlockedRef.current.length),
        );
        return true;
      },
      onConfirm: () => {
        playSelectRef.current();
        const selected = unlockedRef.current[charIndexRef.current];
        if (!selected) return;
        setCharacterRef.current(selected.image);
        setViewRef.current("menu");
      },
      onCancel: () => {
        setViewRef.current("menu");
        return true;
      },
    });
  }, [
    player.character,
    selectCharNext,
    selectCharPrev,
    pushControls,
    charIndexRef,
    playMoveRef,
    playSelectRef,
    setCharIndexRef,
    setCharacterRef,
    setViewRef,
    unlockedRef,
  ]);

  const openCharacterSelectRef = useLatestRef(openCharacterSelect);

  useEffect(() => {
    if (!isOpen) return;

    const remove = pushControls({
      onLeft: menuCycleHandler(
        viewRef,
        playMoveRef,
        setMenuSelectionRef,
        DEFEAT_MENU_NEXT,
      ),
      onRight: menuCycleHandler(
        viewRef,
        playMoveRef,
        setMenuSelectionRef,
        DEFEAT_MENU_PREV,
      ),
      onUp: menuCycleHandler(
        viewRef,
        playMoveRef,
        setMenuSelectionRef,
        DEFEAT_MENU_PREV,
      ),
      onDown: menuCycleHandler(
        viewRef,
        playMoveRef,
        setMenuSelectionRef,
        DEFEAT_MENU_NEXT,
      ),
      onConfirm: () => {
        if (viewRef.current !== "menu") return false;
        if (menuSelectionRef.current === "characterSelect") {
          openCharacterSelectRef.current();
          return true;
        }
        return false;
      },
    });

    return remove;
  }, [
    isOpen,
    pushControls,
    menuSelectionRef,
    openCharacterSelectRef,
    playMoveRef,
    setMenuSelectionRef,
    viewRef,
  ]);

  useEffect(() => {
    if (!isOpen) {
      setMenuSelection("retry");
      setView("menu");
    }
  }, [isOpen]);

  const selectCharacter = useCallback(
    (index: number) => {
      playSelectRef.current();
      const selected = unlockedRef.current[index];
      if (!selected) return;
      setCharacterRef.current(selected.image);
      setViewRef.current("menu");
    },
    [playSelectRef, setCharacterRef, setViewRef, unlockedRef],
  );

  const selectCharacterRef = useLatestRef(selectCharacter);

  return {
    unlockedCharacters,
    menuSelection,
    charIndex,
    view,
    openCharacterSelect: openCharacterSelectRef.current,
    selectCharacter: selectCharacterRef.current,
  };
}
