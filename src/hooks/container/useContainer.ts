import { useCallback, useEffect, useRef, useState } from "react";

import { useGameControls } from "@/contexts/GameControlsContext";
import { gridMove } from "@/gameRules/menu/navigation";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { useCompressedStorage } from "@/hooks/useCompressedStorage";

import type { ContainerSlots } from "@/utils/types/container";
import type { InventoryItem } from "@/utils/types/player/inventory";

type Params = {
  storageKey: string;
  defaultSlots: ContainerSlots;
  size: number;
  cols?: number;
  onPickup?: (index: number, slot: InventoryItem) => boolean;
  onClose?: () => void;
};

export function useContainer({
  storageKey,
  defaultSlots,
  size,
  cols = 3,
  onPickup,
  onClose,
}: Params) {
  const { pushControls } = useGameControls();
  const { playMove, playSelect, playClose } = useMenuSFX();

  const [slots, setSlots] = useCompressedStorage<ContainerSlots>(
    storageKey,
    defaultSlots,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const slotsRef = useRef(slots);
  slotsRef.current = slots;
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;
  const colsRef = useRef(cols);
  colsRef.current = cols;
  const sizeRef = useRef(size);
  sizeRef.current = size;

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const playCloseRef = useRef(playClose);
  playCloseRef.current = playClose;
  const onPickupRef = useRef(onPickup);
  onPickupRef.current = onPickup;
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  const open = useCallback(() => {
    setSelectedIndex(0);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    onCloseRef.current?.();
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          gridMove(prev, colsRef.current, "up", sizeRef.current),
        );
        return true;
      },

      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          gridMove(prev, colsRef.current, "down", sizeRef.current),
        );
        return true;
      },

      onLeft: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          gridMove(prev, colsRef.current, "left", sizeRef.current),
        );
        return true;
      },

      onRight: () => {
        playMoveRef.current();
        setSelectedIndex((prev) =>
          gridMove(prev, colsRef.current, "right", sizeRef.current),
        );
        return true;
      },

      onConfirm: () => {
        const index = selectedIndexRef.current;
        const slot = slotsRef.current[index] ?? null;
        if (!slot) return true;

        const handled = onPickupRef.current?.(index, slot) ?? true;
        if (handled) {
          setSlots((prev) =>
            prev.map((s, i) => (i === index ? null : s)),
          );
          playSelectRef.current();
        }
        return true;
      },

      onCancel: () => {
        playCloseRef.current();
        close();
        return true;
      },

      blockGlobalOpen: true,
    };

    const remove = pushControls(controls);
    return remove;
  }, [isOpen, pushControls, close, setSlots]);

  return {
    isOpen,
    open,
    close,
    slots,
    setSlots,
    selectedIndex,
  };
}
