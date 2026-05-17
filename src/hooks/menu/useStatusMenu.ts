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

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        playMove();
        setSelectedIndex((prev) =>
          circularPrev(prev, OPTIONS.length)
        );
      },

      onDown: () => {
        playMove();
        setSelectedIndex((prev) =>
          circularNext(prev, OPTIONS.length)
        );
      },

      onConfirm: () => {
        playSelect();
        const stat = OPTIONS[selectedIndexRef.current];
        const char = progress[player.character];

        if (!canSpendPoints(char.stats.points)) return true;

        addStat(player.character, stat);
        return true;
      },

      blockGlobalOpen: true,
    };

    pushControls(controls);
    return () => popControls();
  }, [isOpen, progress, player.character]);

  return {
    selectedIndex,
    options: OPTIONS,
  };
}