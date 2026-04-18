import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { CHARACTERS } from "@/data/options/characters";
import type { CharacterId } from "@/utils/types/character";

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
    const controls = {
      onConfirm: () => {
        const selected = selectableCharacters[selectedIndexRef.current];
        handleChooseCharacter(selected.image as CharacterId);
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

  // ⬅️➡️ MOVIMENTO
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "d") {
        setSelectedIndex((prev) =>
          prev === selectableCharacters.length - 1 ? 0 : prev + 1
        );
      }

      if (e.key === "ArrowLeft" || e.key === "a") {
        setSelectedIndex((prev) =>
          prev === 0 ? selectableCharacters.length - 1 : prev - 1
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return {
    characters: CHARACTERS,
    selectableCharacters,
    selectedIndex,
  };
}