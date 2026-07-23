import { useEffect, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";

type Params = {
  filterFocused: boolean;
  selectedItem: { id: string } | undefined;
  isConsumableSelected: boolean;
  isChestSelected: boolean;
  isMapSelected: boolean;
  isMountSelected: boolean;
  keyId: string | null;
  items: { id: string }[];
  openPlayerChest: (id: ItemId) => void;
  getEffect: (id: string) => (() => void) | null;
  consumeItem: (id: string) => void;
  onReject: (index: number) => void;
  onNoKey: () => void;
};

export function useItemControls({
  filterFocused,
  selectedItem,
  isConsumableSelected,
  isChestSelected,
  isMapSelected,
  isMountSelected,
  keyId,
  items,
  openPlayerChest,
  getEffect,
  consumeItem,
  onReject,
  onNoKey,
}: Params) {
  const { pushControls, popControls } = useGameControls();
  const filterFocusedRef = useRef(filterFocused);
  filterFocusedRef.current = filterFocused;
  const consumeItemRef = useRef(consumeItem);
  consumeItemRef.current = consumeItem;

  useEffect(() => {
    const controls = {
      onConfirm: () => {
        if (filterFocusedRef.current) return false;
        if (!selectedItem) return false;

        if (isConsumableSelected) {
          consumeItemRef.current(selectedItem.id);
          return true;
        }

        if (isChestSelected) {
          if (keyId && items.some((i) => i.id === keyId)) {
            openPlayerChest(selectedItem.id as ItemId);
          } else {
            onNoKey();
          }
          return true;
        }

        if (isMapSelected || isMountSelected) {
          const effect = getEffect(selectedItem.id);
          if (effect) {
            effect();
            return true;
          }
        }

        onReject(selectedItem ? -1 : 0);
        return true;
      },
    };

    pushControls(controls);
    return () => popControls();
  }, [
    isChestSelected,
    isConsumableSelected,
    isMapSelected,
    isMountSelected,
    selectedItem,
    keyId,
    items,
    openPlayerChest,
    getEffect,
    pushControls,
    popControls,
    onReject,
    onNoKey,
  ]);
}
