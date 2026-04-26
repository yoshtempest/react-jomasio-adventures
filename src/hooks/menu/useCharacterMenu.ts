import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { CHARACTERS } from "@/data/options/characters";
import type { CharacterId } from "@/utils/types/player/character";
import { circularNext, circularPrev, gridMove } from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";

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
      onRight: () => {
        setSelectedIndex((prev) =>
          circularNext(prev, selectableCharacters.length)
        );
      },

      onLeft: () => {
        setSelectedIndex((prev) =>
          circularPrev(prev, selectableCharacters.length)
        );
      },

      onDown: () => {
        setSelectedIndex((prev) => 
          gridMove(prev, 6, "down", selectableCharacters.length)
        );
      },

      onUp: () => {
        setSelectedIndex((prev) =>
          gridMove(prev, 6, "up", selectableCharacters.length)
        );
      },

      onConfirm: () => {
        const selected = getSelected(selectableCharacters, selectedIndexRef.current);
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