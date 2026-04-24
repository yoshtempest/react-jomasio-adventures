import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { CHARACTERS } from "@/data/options/characters";
import type { CharacterId } from "@/utils/types/player/character";

export function useCharacterMenu() {
  const { setCharacter, setMode } = usePlayer();
  const { closeNavbar } = useNavbar();
  const { pushControls, popControls } = useGameControls();

  const selectableCharacters = CHARACTERS.filter((c) => c.selectable);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  function handleChooseCharacter(id: CharacterId) {
    setCharacter(id);
  }

  // 🎮 CONTROLES
  useEffect(() => {
    const COLS = 6;

    const controls = {
      onRight: () => {
        setSelectedIndex((prev) =>
          prev === selectableCharacters.length - 1 ? 0 : prev + 1
        );
      },

      onLeft: () => {
        setSelectedIndex((prev) =>
          prev === 0 ? selectableCharacters.length - 1 : prev - 1
        );
      },

      onDown: () => {
        setSelectedIndex((prev) => {
          const next = prev + COLS;
          if (next >= selectableCharacters.length) return prev; // não desce
          return next;
        });
      },

      onUp: () => {
        setSelectedIndex((prev) => {
          const next = prev - COLS;
          if (next < 0) return prev; // não sobe
          return next;
        });
      },

      onConfirm: () => {
        const selected = selectableCharacters[selectedIndexRef.current];
        handleChooseCharacter(selected.image as CharacterId);
        return true;
      },

      onCancel: () => {
        closeNavbar();
        setMode("explore");
      },

      blockGlobalOpen: true,
    };

    pushControls(controls);
    return () => popControls();
  }, []);

  return {
    characters: CHARACTERS,
    selectableCharacters,
    selectedIndex,
  };
}