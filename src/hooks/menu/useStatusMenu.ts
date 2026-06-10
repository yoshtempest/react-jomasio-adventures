import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { canSpendPoints } from "@/gameRules/menu/validation";
import { STATS } from "@/utils/types/player/stats";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

const OPTIONS = STATS;

export function useStatusMenu(isOpen: boolean) {
  const { pushControls, popControls } = useGameControls();
  const { addStat, progress } = useCharacterProgress();
  const { player } = usePlayer();
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;
  const addStatRef = useRef(addStat);
  addStatRef.current = addStat;

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          circularPrev(prev, OPTIONS.length)
        );
      },

      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          circularNext(prev, OPTIONS.length)
        );
      },

      onConfirm: () => {
        playSelectRef.current();
        const stat = OPTIONS[selectedIndexRef.current];
        const char = progress[player.character];

        if (!canSpendPoints(char.stats.points)) return true;

        addStatRef.current(player.character, stat);
        return true;
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isOpen, progress, player.character]);

  return {
    selectedIndex,
    options: OPTIONS,
  };
}