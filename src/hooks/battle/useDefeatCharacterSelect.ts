import { useEffect, useRef, useState, useCallback } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useFlags } from "@/contexts/FlagContext";
import { CHARACTERS } from "@/data/options/characters";
import { gridMove, circularNext, circularPrev } from "@/gameRules/menu/navigation";

const CHAR_UNLOCK_FLAGS: Record<string, FlagId> = {
  samuel: "samurionUnlocked",
  artur: "srGuaxinimUnlocked",
  emanuel: "ematronUnlocked",
  larissa: "laricellUnlocked",
  mayra: "yraUnlocked",
  camilly: "kamykazeUnlocked",
  lucas: "yvelUnlocked",
  lucaua: "babidiUnlocked",
  riquelme: "riquelsonUnlocked",
};

export type DefeatMenuSelection = "retry" | "flee" | "characterSelect";
type View = "menu" | "characterSelect";

export function useDefeatCharacterSelect(isOpen: boolean) {
  const { player, setCharacter } = usePlayer();
  const { hasFlag } = useFlags();
  const { playMove, playSelect } = useMenuSFX();
  const { pushControls, popControls } = useGameControls();

  const unlockedCharacters = CHARACTERS.filter(
    (c) =>
      c.selectable ||
      (c.image in CHAR_UNLOCK_FLAGS && hasFlag(CHAR_UNLOCK_FLAGS[c.image])),
  );

  const [menuSelection, setMenuSelection] =
    useState<DefeatMenuSelection>("retry");
  const [charIndex, setCharIndex] = useState(0);
  const [view, setView] = useState<View>("menu");

  const menuSelectionRef = useRef(menuSelection);
  menuSelectionRef.current = menuSelection;
  const charIndexRef = useRef(charIndex);
  charIndexRef.current = charIndex;
  const viewRef = useRef(view);
  viewRef.current = view;
  const unlockedRef = useRef(unlockedCharacters);
  unlockedRef.current = unlockedCharacters;
  const setCharacterRef = useRef(setCharacter);
  setCharacterRef.current = setCharacter;
  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const setMenuSelectionRef = useRef(setMenuSelection);
  setMenuSelectionRef.current = setMenuSelection;
  const setCharIndexRef = useRef(setCharIndex);
  setCharIndexRef.current = setCharIndex;
  const setViewRef = useRef(setView);
  setViewRef.current = setView;

  const selectCharNext = useCallback(() => {
    playMoveRef.current();
    setCharIndexRef.current((prev) =>
      circularNext(prev, unlockedRef.current.length),
    );
  }, []);

  const selectCharPrev = useCallback(() => {
    playMoveRef.current();
    setCharIndexRef.current((prev) =>
      circularPrev(prev, unlockedRef.current.length),
    );
  }, []);

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
        setCharacterRef.current(selected.image as CharacterId);
        setViewRef.current("menu");
      },
      onCancel: () => {
        setViewRef.current("menu");
        return true;
      },
    });
  }, [player.character, selectCharNext, selectCharPrev, pushControls]);

  const openCharacterSelectRef = useRef(openCharacterSelect);
  openCharacterSelectRef.current = openCharacterSelect;

  useEffect(() => {
    if (!isOpen) return;

    pushControls({
      onLeft: () => {
        if (viewRef.current !== "menu") return;
        playMoveRef.current();
        setMenuSelectionRef.current((prev) => {
          if (prev === "retry") return "flee";
          if (prev === "flee") return "characterSelect";
          return "retry";
        });
      },
      onRight: () => {
        if (viewRef.current !== "menu") return;
        playMoveRef.current();
        setMenuSelectionRef.current((prev) => {
          if (prev === "retry") return "characterSelect";
          if (prev === "characterSelect") return "flee";
          return "retry";
        });
      },
      onUp: () => {
        if (viewRef.current !== "menu") return;
        playMoveRef.current();
        setMenuSelectionRef.current((prev) => {
          if (prev === "retry") return "characterSelect";
          if (prev === "flee") return "retry";
          return "flee";
        });
      },
      onDown: () => {
        if (viewRef.current !== "menu") return;
        playMoveRef.current();
        setMenuSelectionRef.current((prev) => {
          if (prev === "retry") return "flee";
          if (prev === "flee") return "characterSelect";
          return "retry";
        });
      },
      onConfirm: () => {
        if (viewRef.current !== "menu") return;
        const sel = menuSelectionRef.current;
        if (sel === "characterSelect") {
          openCharacterSelectRef.current();
        }
      },
    });

    return () => popControls();
  }, [isOpen, pushControls, popControls]);

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
      setCharacterRef.current(selected.image as CharacterId);
      setViewRef.current("menu");
    },
    [],
  );

  const selectCharacterRef = useRef(selectCharacter);
  selectCharacterRef.current = selectCharacter;

  return {
    unlockedCharacters,
    menuSelection,
    charIndex,
    view,
    openCharacterSelect: openCharacterSelectRef.current,
    selectCharacter: selectCharacterRef.current,
  };
}
