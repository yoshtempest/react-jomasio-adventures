import { useState } from "react";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { canSpendPoints } from "@/gameRules/menu/validation";
import { STATS } from "@/utils/types/player/stats";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useStableCallback } from "@/hooks/useStableCallback";
import { useGameControlsLayer } from "@/hooks/useGameControlsLayer";
import { useSelectableIndex } from "@/hooks/useSelectableIndex";

const OPTIONS = STATS;
const TOTAL_OPTIONS = STATS.length + 2;
const SKILL_TREE_INDEX = STATS.length;
const RANKS_INDEX = STATS.length + 1;

export function useStatusMenu(isOpen: boolean) {
  const { addStat, progress } = useCharacterProgress();
  const { player } = usePlayer();
  const { playMove, playSelect } = useMenuSFX();

  const [view, setView] = useState<"stats" | "skillTree" | "ranks">("stats");
  const { selectedIndex, setSelectedIndex, selectedIndexRef } = useSelectableIndex();

  const onUp = useStableCallback(() => {
    if (view !== "stats") return;
    playMove();
    setSelectedIndex((prev) => circularPrev(prev, TOTAL_OPTIONS));
  });

  const onDown = useStableCallback(() => {
    if (view !== "stats") return;
    playMove();
    setSelectedIndex((prev) => circularNext(prev, TOTAL_OPTIONS));
  });

  const onConfirm = useStableCallback(() => {
    if (view === "skillTree") return true;
    if (view === "ranks") return true;
    playSelect();
    const index = selectedIndexRef.current;
    if (index === SKILL_TREE_INDEX) {
      setView("skillTree");
      return true;
    }
    if (index === RANKS_INDEX) {
      setView("ranks");
      return true;
    }
    const stat = STATS[index];
    const char = progress[player.character];
    if (!canSpendPoints(char.stats.points)) return true;
    addStat(player.character, stat);
    return true;
  });

  const onCancel = useStableCallback(() => {
    if (view !== "stats") {
      setView("stats");
      return true;
    }
  });

  useGameControlsLayer(
    {
      onUp,
      onDown,
      onConfirm,
      onCancel,
      blockGlobalOpen: true,
    },
    [isOpen],
  );

  return {
    selectedIndex,
    options: OPTIONS,
    view,
  };
}
