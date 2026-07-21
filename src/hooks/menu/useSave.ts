import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import {
  getActiveSlot,
  setActiveSlot,
  isSlotUsed,
  clearSlot,
  getUsedSlots,
  getAvailableSlots,
  type SlotIndex,
} from "@/utils/save/slotManager";
import type { SaveItem, ConfirmScreen } from "@/utils/save/SaveItem";
import { loadGameForSlot } from "@/utils/save/saveGame";
import { getSceneLabel } from "@/utils/sceneImages";
import type { SaveTab } from "@/data/saves/tabs";
import { SAVE_TABS, SAVE_TAB_COUNT } from "@/data/saves/tabs";

export function useSaveMenu(listRef?: React.RefObject<HTMLDivElement | null>) {
  const navigate = useNavigate();
  const { pushControls, popControls } = useGameControls();
  const { closeNavbar } = useNavbar();
  const { setMode } = usePlayer();
  const { playMove, playSelect } = useMenuSFX();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);
  selectedIndexRef.current = selectedIndex;
  const [confirmDelete, setConfirmDelete] = useState<ConfirmScreen>("none");
  const [refreshKey, setRefreshKey] = useState(0);
  const [activeTab, setActiveTab] = useState<SaveTab>("saves");
  const [isOnTab, setIsOnTab] = useState(true);

  const activeSlot = getActiveSlot();
  const availableSlots = getAvailableSlots();

  const playMoveRef = useRef(playMove);
  playMoveRef.current = playMove;
  const playSelectRef = useRef(playSelect);
  playSelectRef.current = playSelect;
  const closeNavbarRef = useRef(closeNavbar);
  closeNavbarRef.current = closeNavbar;
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;
  const navigateRef = useRef(navigate);
  navigateRef.current = navigate;

  const refreshRef = useRef(() => setRefreshKey((k) => k + 1));

  const items = useMemo((): SaveItem[] => {
    if (activeTab !== "saves") return [];

    const list: SaveItem[] = [];

    for (const slot of [0, 1] as SlotIndex[]) {
      if (isSlotUsed(slot)) {
        const save = loadGameForSlot(slot);
        const sceneLabel = save?.lastRoute
          ? getSceneLabel(save.lastRoute)
          : "Sem progresso";
        const isActive = slot === activeSlot;
        list.push({
          key: `slot-${slot}`,
          label: `Save ${slot + 1}: ${sceneLabel}${isActive ? " (Ativo)" : ""}`,
          slot,
        });
        list.push({
          key: `delete-${slot}`,
          label: `Excluir Save ${slot + 1}`,
          danger: true,
          slot,
        });
      } else {
        list.push({
          key: `slot-${slot}`,
          label: `Save ${slot + 1}: Vazio`,
          slot,
        });
      }
    }

    if (availableSlots.length > 0) {
      list.push({ key: "newGame", label: "Novo Jogo" });
    }

    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshKey, activeSlot, activeTab]);

  const isOnTabRef = useRef(isOnTab);
  isOnTabRef.current = isOnTab;
  const activeTabRef = useRef(activeTab);
  activeTabRef.current = activeTab;
  const confirmDeleteRef = useRef(confirmDelete);
  confirmDeleteRef.current = confirmDelete;
  const itemsRef = useRef(items);
  itemsRef.current = items;

  useEffect(() => {
    if (selectedIndex >= items.length) setSelectedIndex(0);
  }, [items, selectedIndex]);

  useEffect(() => {
    pushControls({
      onUp: () => {
        playMoveRef.current();

        if (isOnTabRef.current) return;

        if (confirmDeleteRef.current !== "none") return;

        if (activeTabRef.current === "replays") {
          setIsOnTab(true);
          return;
        }

        if (selectedIndexRef.current === 0) {
          setIsOnTab(true);
          return;
        }

        setSelectedIndex((prev) => prev - 1);
      },
      onDown: () => {
        playMoveRef.current();

        if (isOnTabRef.current) {
          setIsOnTab(false);
          setSelectedIndex(0);
          return;
        }

        if (confirmDeleteRef.current !== "none") return;

        if (activeTabRef.current === "replays") return;

        const count = itemsRef.current.length;
        setSelectedIndex((prev) => (prev + 1) % count);
      },
      onLeft: () => {
        if (!isOnTabRef.current) return;
        playMoveRef.current();
        setActiveTab((prev) => {
          const currentIdx = SAVE_TABS.indexOf(prev);
          return SAVE_TABS[(currentIdx - 1 + SAVE_TAB_COUNT) % SAVE_TAB_COUNT];
        });
        setSelectedIndex(0);
      },
      onRight: () => {
        if (!isOnTabRef.current) return;
        playMoveRef.current();
        setActiveTab((prev) => {
          const currentIdx = SAVE_TABS.indexOf(prev);
          return SAVE_TABS[(currentIdx + 1) % SAVE_TAB_COUNT];
        });
        setSelectedIndex(0);
      },
      onConfirm: () => {
        if (isOnTabRef.current) return true;

        const idx = selectedIndexRef.current;
        if (confirmDeleteRef.current !== "none") {
          if (idx === 0) {
            playSelectRef.current();
            clearSlot(confirmDeleteRef.current.slot);
            if (confirmDeleteRef.current.slot === getActiveSlot()) {
              const remaining = getUsedSlots();
              if (remaining.length > 0) setActiveSlot(remaining[0]);
            }
            setConfirmDelete("none");
            refreshRef.current();
            if (!getUsedSlots().length) {
              closeNavbarRef.current();
              setModeRef.current("explore");
              sessionStorage.setItem("saveSwitchTarget", "/tutorial");
              window.location.replace(import.meta.env.BASE_URL);
            }
          } else {
            playMoveRef.current();
            setConfirmDelete("none");
            setSelectedIndex(0);
          }
          return;
        }

        const item = itemsRef.current[idx];
        if (!item) return;

        playSelectRef.current();

        if (activeTabRef.current === "replays") return true;

        if (item.key.startsWith("slot-") && item.slot !== undefined) {
          const slot = item.slot;
          if (!isSlotUsed(slot)) return;
          if (slot === getActiveSlot()) return;
          setActiveSlot(slot);
          closeNavbarRef.current();
          setModeRef.current("explore");
          window.location.reload();
        } else if (item.key.startsWith("delete-") && item.slot !== undefined) {
          if (!isSlotUsed(item.slot)) return;
          setConfirmDelete({ slot: item.slot });
          setSelectedIndex(0);
        } else if (item.key === "newGame") {
          const free = getAvailableSlots()[0];
          if (free === undefined) return;
          setActiveSlot(free);
          clearSlot(free);
          sessionStorage.setItem("saveSwitchTarget", "/tutorial");
          window.location.replace(import.meta.env.BASE_URL);
        } else if (item.key === "back") {
          closeNavbarRef.current();
          setModeRef.current("explore");
        }
      },
      onCancel: () => {
        if (confirmDeleteRef.current !== "none") {
          setConfirmDelete("none");
          setSelectedIndex(0);
          return true;
        }
        // Let navbar layer handle — returns to menu, not closes everything
      },
      blockGlobalOpen: true,
    });

    return () => popControls();
  }, [pushControls, popControls]);

  useEffect(() => {
    if (!listRef?.current) return;
    const container = listRef.current;
    const selectedElement = container.children[selectedIndex] as HTMLElement;
    if (!selectedElement) return;
    selectedElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
  }, [selectedIndex, listRef]);

  return {
    confirmDelete,
    selectedIndex,
    items,
    activeSlot,
    activeTab,
    isOnTab,
  };
}
