import { useEffect, useRef } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";

type Params = {
  filterFocused: boolean;
  chestFocused: boolean;
  selectedItem: { id: string } | undefined;
  isConsumableSelected: boolean;
  isChestSelected: boolean;
  isMapSelected: boolean;
  isMountSelected: boolean;
  isTeleportSelected: boolean;
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
  chestFocused,
  selectedItem,
  isConsumableSelected,
  isChestSelected,
  isMapSelected,
  isMountSelected,
  isTeleportSelected,
  keyId,
  items,
  openPlayerChest,
  getEffect,
  consumeItem,
  onReject,
  onNoKey,
}: Params) {
  const { pushControls } = useGameControls();
  const stateRef = useRef({
    filterFocused,
    chestFocused,
    selectedItem,
    isConsumableSelected,
    isChestSelected,
    isMapSelected,
    isMountSelected,
    isTeleportSelected,
    keyId,
    items,
  });
  stateRef.current = {
    filterFocused,
    chestFocused,
    selectedItem,
    isConsumableSelected,
    isChestSelected,
    isMapSelected,
    isMountSelected,
    isTeleportSelected,
    keyId,
    items,
  };
  const openPlayerChestRef = useRef(openPlayerChest);
  openPlayerChestRef.current = openPlayerChest;
  const getEffectRef = useRef(getEffect);
  getEffectRef.current = getEffect;
  const consumeItemRef = useRef(consumeItem);
  consumeItemRef.current = consumeItem;
  const onRejectRef = useRef(onReject);
  onRejectRef.current = onReject;
  const onNoKeyRef = useRef(onNoKey);
  onNoKeyRef.current = onNoKey;

  useEffect(() => {
    const controls = {
      onConfirm: () => {
        const {
          filterFocused,
          chestFocused,
          selectedItem,
          isConsumableSelected,
          isChestSelected,
          isMapSelected,
          isMountSelected,
          isTeleportSelected,
          keyId,
          items,
        } = stateRef.current;
        if (filterFocused) return false;
        if (chestFocused) return false;
        if (!selectedItem) return false;

        if (isConsumableSelected) {
          consumeItemRef.current(selectedItem.id);
          return true;
        }

        if (isChestSelected) {
          if (keyId && items.some((i) => i.id === keyId)) {
            openPlayerChestRef.current(selectedItem.id as ItemId);
          } else {
            onNoKeyRef.current();
          }
          return true;
        }

        if (isMapSelected || isMountSelected || isTeleportSelected) {
          const effect = getEffectRef.current(selectedItem.id);
          if (effect) {
            effect();
            return true;
          }
        }

        onRejectRef.current(selectedItem ? -1 : 0);
        return true;
      },
    };

    const remove = pushControls(controls);
    return remove;
  }, [pushControls]);
}
