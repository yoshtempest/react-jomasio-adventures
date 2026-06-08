import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { CHARACTERS } from "@/data/options/characters";
import { circularNext, circularPrev, gridMove } from "@/gameRules/menu/navigation";
import { getSelected } from "@/gameRules/menu/selection";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useFlags } from "@/contexts/FlagContext";

export function useCharacterMenu() {
  const { setCharacter } = usePlayer();
  const { pushControls, popControls } = useGameControls();
  const { playMove, playSelect } = useMenuSFX();
  const { hasFlag } = useFlags();

  const selectableCharacters = CHARACTERS.filter((c) =>
    c.selectable ||
    (c.image === "samuel" && hasFlag("samurionUnlocked")) ||
    (c.image === "lucas" && hasFlag("yvelUnlocked")) ||
    (c.image === "artur" && hasFlag("srGuaxinimUnlocked"))
  );

  const characters = CHARACTERS.map((c) => ({
    ...c,
    selectable:
      c.selectable ||
      (c.image === "samuel" && hasFlag("samurionUnlocked")) ||
      (c.image === "lucas" && hasFlag("yvelUnlocked")) ||
      (c.image === "artur" && hasFlag("srGuaxinimUnlocked")),
  }));

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
    characters,
    selectableCharacters,
    selectedIndex,
  };
}