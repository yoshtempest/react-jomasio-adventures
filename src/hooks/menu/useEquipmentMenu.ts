import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { getEquipmentById } from "@/data/equipment";
import { EQUIPMENT_SLOTS } from "@/utils/types/player/equipment";
import type { Equipment, EquipmentSlot } from "@/utils/types/player/equipment";

export type EquipmentMenuItem =
  | {
      type: "slot";
      slot: EquipmentSlot;
      item: Equipment | null;
    }
  | {
      type: "collected";
      item: Equipment;
    };

const EQUIPPED_COUNT = 4;

export function useEquipmentMenu(
  isOpen: boolean,
  character: CharacterId,
  leftListRef?: React.RefObject<HTMLDivElement | null>,
  rightListRef?: React.RefObject<HTMLDivElement | null>
) {
  const { pushControls, popControls } = useGameControls();
  const { getEquippedItem, getCollection, equip, unequip } = useEquipment();
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  const equippedItems: EquipmentMenuItem[] = EQUIPMENT_SLOTS.map((slot) => ({
    type: "slot" as const,
    slot,
    item: getEquippedItem(character, slot),
  }));

  const collectedItems: EquipmentMenuItem[] = Object.entries(
    getCollection(character)
  )
    .filter(([, qty]) => qty > 0)
    .map(([id]) => getEquipmentById(id))
    .filter((e): e is Equipment => e !== null)
    .map((item) => ({ type: "collected" as const, item }));

  const totalItems = EQUIPPED_COUNT + collectedItems.length;

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  // auto-scroll right panel
  useEffect(() => {
    if (!rightListRef?.current) return;

    const container = rightListRef.current;
    const relativeIndex = selectedIndex - EQUIPPED_COUNT;
    if (relativeIndex < 0) return;

    const selectedElement = container.children[relativeIndex] as HTMLElement | undefined;
    if (!selectedElement) return;

    const itemHeight = selectedElement.offsetHeight;
    const styles = window.getComputedStyle(container);
    const gap = parseInt(styles.rowGap || "0");
    const rowHeight = itemHeight + gap;
    const targetScroll = relativeIndex * rowHeight;

    container.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, [selectedIndex, rightListRef]);

  // clamp index when total changes
  useEffect(() => {
    setSelectedIndex((prev) =>
      totalItems === 0 ? 0 : Math.min(prev, totalItems - 1)
    );
  }, [totalItems]);

  function handleUseItem(index: number) {
    if (index < EQUIPPED_COUNT) {
      const entry = equippedItems[index];
      if (!entry || !entry.item) return false;
      playSelect();
      unequip(character, entry.slot);
      return true;
    }

    const entry = collectedItems[index - EQUIPPED_COUNT];
    if (!entry) return false;
    playSelect();
    equip(character, entry.item.id);
    return true;
  }

  function navigate(
    prev: number,
    direction: "up" | "down" | "left" | "right"
  ): number {
    if (prev < EQUIPPED_COUNT) {
      if (direction === "up") return prev > 0 ? prev - 1 : prev;
      if (direction === "down")
        return prev < EQUIPPED_COUNT - 1 ? prev + 1 : prev;
      if (direction === "right" && totalItems > EQUIPPED_COUNT)
        return EQUIPPED_COUNT;
      return prev;
    }

    if (direction === "up") return prev > EQUIPPED_COUNT ? prev - 1 : prev;
    if (direction === "down")
      return prev < totalItems - 1 ? prev + 1 : prev;
    if (direction === "left") return EQUIPPED_COUNT - 1;
    return prev;
  }

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const pushControlsRef = useRef(pushControls);
  pushControlsRef.current = pushControls;
  const popControlsRef = useRef(popControls);
  popControlsRef.current = popControls;
  const handleUseItemRef = useRef<(index: number) => boolean>(() => false);
  handleUseItemRef.current = handleUseItem;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  useEffect(() => {
    if (!isOpen) return;

    const controls = {
      onRight: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => navigateRef.current(prev, "right"));
      },

      onLeft: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => navigateRef.current(prev, "left"));
      },

      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => navigateRef.current(prev, "down"));
      },

      onUp: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => navigateRef.current(prev, "up"));
      },

      onConfirm: () => {
        return handleUseItemRef.current(selectedIndexRef.current);
      },

      blockGlobalOpen: true,
    };

    pushControlsRef.current(controls);
    return () => popControlsRef.current();
  }, [isOpen, totalItems]);

  return {
    selectedIndex,
    equippedItems,
    collectedItems,
  };
}
