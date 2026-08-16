import { useEffect } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useLatestRef } from "@/hooks/useLatestRef";

type Params = {
  filterFocused: boolean;
  chestFocused: boolean;
  selectedItem: { id: string } | undefined;
  isConsumableSelected: boolean;
  isChestSelected: boolean;
  isMapSelected: boolean;
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
  const stateRef = useLatestRef({
    filterFocused,
    chestFocused,
    selectedItem,
    isConsumableSelected,
    isChestSelected,
    isMapSelected,
    isTeleportSelected,
    keyId,
    items,
  });
  const openPlayerChestRef = useLatestRef(openPlayerChest);
  const getEffectRef = useLatestRef(getEffect);
  const consumeItemRef = useLatestRef(consumeItem);
  const onRejectRef = useLatestRef(onReject);
  const onNoKeyRef = useLatestRef(onNoKey);

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

        if (isMapSelected || isTeleportSelected) {
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
  }, [pushControls, consumeItemRef, getEffectRef, onNoKeyRef, onRejectRef, openPlayerChestRef, stateRef]);
}
