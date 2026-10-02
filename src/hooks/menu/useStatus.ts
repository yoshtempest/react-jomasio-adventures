import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { canSpendPoints } from "@/gameRules/menu/validation";
import { STATS } from "@/data/player/statList";
import { useCircularSelection } from "@/hooks/menu/useCircularSelection";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useStableCallback } from "@/hooks/useStableCallback";
import { useGameControlsLayer } from "@/hooks/game/useGameControlsLayer";

export function useStatusMenu(isOpen: boolean) {
  const { addStat, progress } = useCharacterProgress();
  const { player } = usePlayer();
  const { playSelect } = useMenuSFX();

  const { selectedIndex, selectedIndexRef, selectPrev, selectNext } =
    useCircularSelection({ length: STATS.length });

  // retorno descartado: setas não consomem input nesta tela
  const onUp = useStableCallback(() => selectPrev());
  const onDown = useStableCallback(() => selectNext());

  const onConfirm = useStableCallback(() => {
    playSelect();
    const index = selectedIndexRef.current;
    const stat = STATS[index]!;
    const char = progress[player.character];
    if (!canSpendPoints(char.stats.points)) return true;
    addStat(player.character, stat);
    return true;
  });

  useGameControlsLayer(
    {
      onUp,
      onDown,
      onConfirm,
      blockGlobalOpen: true,
    },
    [isOpen],
  );

  return {
    selectedIndex,
    options: STATS,
  };
}
