import { useCallback } from "react";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { useSelectableIndex } from "@/hooks/useSelectableIndex";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

type Params = {
  length: number;
  enabled?: boolean;
};

export function useCircularSelection({ length, enabled = true }: Params) {
  const { selectedIndex, setSelectedIndex, selectedIndexRef } =
    useSelectableIndex();
  const { playMove } = useMenuSFX();

  const selectPrev = useCallback(() => {
    if (!enabled) return false;
    playMove();
    setSelectedIndex((prev) => circularPrev(prev, length));
    return true;
  }, [enabled, length, playMove, setSelectedIndex]);

  const selectNext = useCallback(() => {
    if (!enabled) return false;
    playMove();
    setSelectedIndex((prev) => circularNext(prev, length));
    return true;
  }, [enabled, length, playMove, setSelectedIndex]);

  return {
    selectedIndex,
    setSelectedIndex,
    selectedIndexRef,
    selectPrev,
    selectNext,
  };
}
