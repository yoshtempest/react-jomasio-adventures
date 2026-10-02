import { useCallback } from "react";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { useSelectableIndex } from "@/hooks/useSelectableIndex";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";

type Params<T extends number | null> = {
  length: number;
  enabled?: boolean;
  /**
   * Índice inicial. `null` significa "nada selecionado": o primeiro movimento
   * do jogador escolhe um item. Omitido, o menu começa no primeiro item
   * (comportamento dos menus com seleção automática).
   */
  initialIndex?: T;
};

export function useCircularSelection<T extends number | null = number>({
  length,
  enabled = true,
  initialIndex,
}: Params<T>) {
  // `undefined` = começa no primeiro item; `null` = começa sem seleção.
  const startIndex = (initialIndex === undefined ? 0 : initialIndex) as T;

  const { selectedIndex, setSelectedIndex, selectedIndexRef } =
    useSelectableIndex(startIndex);
  const { playMove } = useMenuSFX();

  const selectPrev = useCallback(() => {
    if (!enabled) return false;
    playMove();
    // De `null`, o cursor entra pelo topo e o wrap cai no último item —
    // `-1`/`length` são índices de fora da tabela, resolvidos pelo wrap.
    setSelectedIndex((prev) => circularPrev(prev ?? length, length) as T);
    return true;
  }, [enabled, length, playMove, setSelectedIndex]);

  const selectNext = useCallback(() => {
    if (!enabled) return false;
    playMove();
    setSelectedIndex((prev) => circularNext(prev ?? -1, length) as T);
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
