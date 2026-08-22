import { useState } from "react";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { canSpendPoints } from "@/gameRules/menu/validation";
import { STATS } from "@/data/player/statList";
import { useCircularSelection } from "@/hooks/menu/useCircularSelection";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useStableCallback } from "@/hooks/useStableCallback";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";

const OPTIONS = STATS;
const TOTAL_OPTIONS = STATS.length + 3;
const SKILL_TREE_INDEX = STATS.length;
const RANKS_INDEX = STATS.length + 1;
const ALL_STATS_INDEX = STATS.length + 2;

export function useStatusMenu(isOpen: boolean) {
  const { addStat, progress } = useCharacterProgress();
  const { player } = usePlayer();
  const { playSelect } = useMenuSFX();

  const [view, setView] = useState<
    "stats" | "skillTree" | "ranks" | "allStats"
  >("stats");

  const { selectedIndex, selectedIndexRef, selectPrev, selectNext } =
    useCircularSelection({ length: TOTAL_OPTIONS, enabled: view === "stats" });

  // retorno descartado: setas não consomem input nesta tela
  const onUp = useStableCallback(() => selectPrev());
  const onDown = useStableCallback(() => selectNext());

  const onConfirm = useStableCallback(() => {
    if (view !== "stats") return true;
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
    if (index === ALL_STATS_INDEX) {
      setView("allStats");
      return true;
    }
    const stat = OPTIONS[index]!;
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
    return false;
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
