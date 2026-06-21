import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { canSpendPoints } from "@/gameRules/menu/validation";
import { STATS } from "@/utils/types/player/stats";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

const OPTIONS = STATS;
const TOTAL_OPTIONS = STATS.length + 1;
const SKILL_TREE_INDEX = STATS.length;

export function useStatusMenu(isOpen: boolean) {
  const { pushControls, popControls } = useGameControls();
  const { addStat, progress } = useCharacterProgress();
  const { player } = usePlayer();
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [view, setView] = useState<"stats" | "skillTree">("stats");
  const selectedIndexRef = useRef(selectedIndex);
  const viewRef = useRef(view);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
    viewRef.current = view;
  }, [selectedIndex, view]);

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
        if (viewRef.current !== "stats") return;
        playMoveRef.current();
        setSelectedIndex((prev) => circularPrev(prev, TOTAL_OPTIONS));
      },

      onDown: () => {
        if (viewRef.current !== "stats") return;
        playMoveRef.current();
        setSelectedIndex((prev) => circularNext(prev, TOTAL_OPTIONS));
      },

      onConfirm: () => {
        if (viewRef.current === "skillTree") return true;
        playSelectRef.current();
        const index = selectedIndexRef.current;
        if (index === SKILL_TREE_INDEX) {
          setView("skillTree");
          return true;
        }
        const stat = STATS[index];
        const char = progress[player.character];
        if (!canSpendPoints(char.stats.points)) return true;
        addStatRef.current(player.character, stat);
        return true;
      },

      onCancel: () => {
        if (viewRef.current === "skillTree") {
          setView("stats");
          return true;
        }
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isOpen, progress, player.character]);

  return {
    selectedIndex,
    options: OPTIONS,
    view,
  };
}
