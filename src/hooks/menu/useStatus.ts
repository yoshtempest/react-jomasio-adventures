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

export type StatusView =
  "stats" | "abilities" | "skillTree" | "ranks" | "allStats";

/**
 * Linhas navegáveis abaixo dos stats. São data-driven de propósito: inserir
 * uma linha aqui desloca todas as outras, e `AvailableStats` /
 * `onConfirm` leem estes mesmos índices em vez de repetir números mágicos.
 */
export const STATUS_SUB_ROWS: {
  index: number;
  label: string;
  icon: string;
  view: StatusView;
}[] = [
  {
    index: STATS.length,
    label: "Habilidades",
    icon: "/assets/status/skills.svg",
    view: "abilities",
  },
  {
    index: STATS.length + 1,
    label: "Árvore de Habilidades",
    icon: "/assets/status/xp.svg",
    view: "skillTree",
  },
  {
    index: STATS.length + 2,
    label: "Ranques",
    icon: "/assets/status/ranks.svg",
    view: "ranks",
  },
  {
    index: STATS.length + 3,
    label: "Todos os Status",
    icon: "/assets/status/skills.svg",
    view: "allStats",
  },
];

const TOTAL_OPTIONS = STATS.length + STATUS_SUB_ROWS.length;

export function useStatusMenu(isOpen: boolean) {
  const { addStat, progress } = useCharacterProgress();
  const { player } = usePlayer();
  const { playSelect } = useMenuSFX();

  const [view, setView] = useState<StatusView>("stats");

  const { selectedIndex, selectedIndexRef, selectPrev, selectNext } =
    useCircularSelection({ length: TOTAL_OPTIONS, enabled: view === "stats" });

  // retorno descartado: setas não consomem input nesta tela
  const onUp = useStableCallback(() => selectPrev());
  const onDown = useStableCallback(() => selectNext());

  const onConfirm = useStableCallback(() => {
    if (view !== "stats") return true;
    playSelect();
    const index = selectedIndexRef.current;
    const subRow = STATUS_SUB_ROWS.find((row) => row.index === index);
    if (subRow) {
      setView(subRow.view);
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
