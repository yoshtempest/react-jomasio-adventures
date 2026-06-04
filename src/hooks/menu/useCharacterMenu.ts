import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { CHARACTERS } from "@/data/options/characters";
import { circularNext, circularPrev, gridMove } from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

export function useCharacterMenu() {
  const { setCharacter } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const { playMove, playSelect } = useMenuSFX();

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
        playMove();
        setSelectedIndex((prev) =>
          circularNext(prev, selectableCharacters.length)
        );
      },

      onLeft: () => {
        playMove();
        setSelectedIndex((prev) =>
          circularPrev(prev, selectableCharacters.length)
        );
      },

      onDown: () => {
        playMove();
        setSelectedIndex((prev) => 
          gridMove(prev, 6, "down", selectableCharacters.length)
        );
      },

      onUp: () => {
        playMove();
        setSelectedIndex((prev) =>
          gridMove(prev, 6, "up", selectableCharacters.length)
        );
      },

      onConfirm: () => {
        playSelect();
        const selected = getSelected(selectableCharacters, selectedIndexRef.current);
        handleChooseCharacter(selected.image as CharacterId);
        return true;
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