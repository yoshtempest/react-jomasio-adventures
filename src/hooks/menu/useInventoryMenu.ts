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
  const itemsRef = useRef(items);

  useEffect(() => {
    itemsRef.current = items;
  }, [items]);  

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    if (selectedIndex >= items.length) {
      setSelectedIndex(0);
    }
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
        const length = itemsRef.current.length;
        setSelectedIndex((prev) =>
          circularPrev(prev, length)
        );
      },

      onDown: () => {
        const length = itemsRef.current.length;
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
  }, [isOpen]);

  return {
    selectedIndex,
    options: items,
  };
}