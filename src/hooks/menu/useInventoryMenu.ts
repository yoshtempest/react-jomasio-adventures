import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
import { useInventory } from "@/contexts/InventoryContext";
import { useItemEffect } from "@/gameRules/items/useItem";

export function useInventoryMenu(isOpen: boolean) {
  const { pushControls, popControls } = useGameControls();
  const { items } = useInventory();
  const { getEffect } = useItemEffect();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  // mantém ref sincronizada (evita stale no confirm)
  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // garante que o índice nunca fique inválido
  useEffect(() => {
    setSelectedIndex((prev) =>
      items.length === 0 ? 0 : Math.min(prev, items.length - 1)
    );
  }, [items]);

  function handleUseItem(index: number) {
    const item = items[index];
    if (!item) return false;

    const effect = getEffect(item.id);
    if (!effect) return false;

    effect();
    return true;
  }

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        const length = items.length;
        if (length === 0) return;

        setSelectedIndex((prev) =>
          circularPrev(prev, length)
        );
      },

      onDown: () => {
        const length = items.length;
        if (length === 0) return;

        setSelectedIndex((prev) =>
          circularNext(prev, length)
        );
      },

      onConfirm: () => {
        return handleUseItem(selectedIndexRef.current);
      },

      blockGlobalOpen: true,
    };

    pushControls(controls);
    return () => popControls();
  }, [isOpen, items]); // 👈 ESSENCIAL

  return {
    selectedIndex,
    options: items,
  };
}