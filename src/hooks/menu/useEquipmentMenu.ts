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
      qty: number;
    };

const EQUIPPED_COUNT = 7;
const FILTER_TAB_COUNT = 8;
const FILTER_TABS = ["all", "helmet", "chestplate", "pants", "boots", "accessory", "bag", "pet"] as const;

export type EquipmentFilter = (typeof FILTER_TABS)[number];

export const FILTER_LABELS: Record<EquipmentFilter, string> = {
  all: "Todos",
  helmet: "Elmos",
  chestplate: "Peitorais",
  pants: "Calças",
  boots: "Botas",
  accessory: "Acessórios",
  bag: "Bolsas",
  pet: "Pets",
};

export function useEquipmentMenu(
  isOpen: boolean,
  character: CharacterId,
  rightItemsRef?: React.RefObject<HTMLDivElement | null>
) {
  const { pushControls, popControls } = useGameControls();
  const { getEquippedItem, getCollection, equip, unequip } =
    useEquipment();
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);
  const [filter, setFilter] = useState<EquipmentFilter>("all");

  const equippedItems = EQUIPMENT_SLOTS.map((slot) => ({
    type: "slot" as const,
    slot,
    item: getEquippedItem(character, slot),
  }));

  const allCollected = Object.entries(getCollection(character))
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const item = getEquipmentById(id);
      return item ? { item, qty } : null;
    })
    .filter((e): e is { item: Equipment; qty: number } => e !== null);

  const filteredItems =
    filter === "all"
      ? allCollected
      : allCollected.filter(({ item }) => item.slot === filter);

  const rightPanelCount = FILTER_TAB_COUNT + filteredItems.length;
  const totalItems = EQUIPPED_COUNT + rightPanelCount;

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    if (!rightItemsRef?.current) return;

    const container = rightItemsRef.current;
    const relativeIndex = selectedIndex - EQUIPPED_COUNT - FILTER_TAB_COUNT;
    if (relativeIndex < 0) return;

    const selectedElement = container.children[relativeIndex] as
      | HTMLElement
      | undefined;
    if (!selectedElement) return;

    const itemHeight = selectedElement.offsetHeight;
    const styles = window.getComputedStyle(container);
    const gap = parseInt(styles.rowGap || "0");
    const rowHeight = itemHeight + gap;
    const targetScroll = relativeIndex * rowHeight;

    container.scrollTo({ top: targetScroll, behavior: "smooth" });
  }, [selectedIndex, rightItemsRef]);

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

    const rightIndex = index - EQUIPPED_COUNT;

    if (rightIndex < FILTER_TAB_COUNT) {
      const newFilter = FILTER_TABS[rightIndex];
      if (newFilter !== filter) {
        playSelect();
        setFilter(newFilter);
      }
      return false;
    }

    const entry = filteredItems[rightIndex - FILTER_TAB_COUNT];
    if (!entry) return false;
    playSelect();
    equip(character, entry.item.id);
    return true;
  }

  function navigate(
    prev: number,
    direction: "up" | "down" | "left" | "right"
  ): number {
    const firstTab = EQUIPPED_COUNT;
    const lastTab = EQUIPPED_COUNT + FILTER_TAB_COUNT - 1;
    const firstItem = EQUIPPED_COUNT + FILTER_TAB_COUNT;

    if (prev < EQUIPPED_COUNT) {
      if (direction === "up") return prev > 0 ? prev - 1 : prev;
      if (direction === "down")
        return prev < EQUIPPED_COUNT - 1 ? prev + 1 : prev;
      if (direction === "right" && totalItems > EQUIPPED_COUNT)
        return firstTab;
      return prev;
    }

    if (prev <= lastTab) {
      if (direction === "right") return prev < lastTab ? prev + 1 : prev;
      if (direction === "left")
        return prev > firstTab ? prev - 1 : EQUIPPED_COUNT - 1;
      if (direction === "down") {
        if (filteredItems.length > 0) return firstItem;
        return EQUIPPED_COUNT - 1;
      }
      if (direction === "up") return EQUIPPED_COUNT - 1;
      return prev;
    }

    if (direction === "up") return prev > firstItem ? prev - 1 : firstTab;
    if (direction === "down")
      return prev < totalItems - 1 ? prev + 1 : prev;
    if (direction === "left") return firstTab;
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
    filteredItems,
    filter,
    allCollected,
  };
}
