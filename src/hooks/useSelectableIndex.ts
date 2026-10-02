import { useState, useRef, useEffect } from "react";

/**
 * Índice selecionado de um menu, com reflexo para os handlers de input.
 *
 * Genérico porque alguns menus precisam de "nada selecionado" (`null`) — o
 * Status só gasta ponto depois que o jogador escolhe um stat. Os menus com
 * seleção automática continuam começando em `0`.
 */
export function useSelectableIndex<T extends number | null>(initialIndex: T) {
  const [selectedIndex, setSelectedIndex] = useState<T>(initialIndex);
  const selectedIndexRef = useRef<T>(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  return { selectedIndex, setSelectedIndex, selectedIndexRef };
}
