import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { usePlayer } from "@/contexts/PlayerContext";
import { useMenuSFX } from "@/hooks/menu/useMenuSFX";
import { circularNext, circularPrev } from "@/gameRules/menu/navigation";
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

export function useSaveMenu() {
    const navigate = useNavigate();
    const { pushControls, popControls } = useGameControls();
    const { closeNavbar } = useNavbar();
    const { setMode } = usePlayer();
    const { playMove, playSelect } = useMenuSFX();

    const [selectedIndex, setSelectedIndex] = useState(0);
    const [confirmDelete, setConfirmDelete] = useState<ConfirmScreen>("none");
    const [refreshKey, setRefreshKey] = useState(0);

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

    const selectedIndexRef = useRef(selectedIndex);
    selectedIndexRef.current = selectedIndex;

    const refreshRef = useRef(() => setRefreshKey((k) => k + 1));

    const items = useMemo((): SaveItem[] => {
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
    }, [refreshKey, activeSlot]);

    useEffect(() => {
        if (selectedIndex >= items.length) setSelectedIndex(0);
    }, [items, selectedIndex]);

    useEffect(() => {
        pushControls({
            onUp: () => {
                playMoveRef.current();
                setSelectedIndex((prev) => circularPrev(prev, confirmDelete === "none" ? items.length : 2));
            },
            onDown: () => {
                playMoveRef.current();
                setSelectedIndex((prev) => circularNext(prev, confirmDelete === "none" ? items.length : 2));
            },
            onConfirm: () => {
                const idx = selectedIndexRef.current;
                if (confirmDelete !== "none") {
                if (idx === 0) {
                    playSelectRef.current();
                    clearSlot(confirmDelete.slot);
                    if (confirmDelete.slot === getActiveSlot()) {
                    const remaining = getUsedSlots();
                    if (remaining.length > 0) { setActiveSlot(remaining[0]); }
                    }
                    setConfirmDelete("none");
                    refreshRef.current();
                    if (!getUsedSlots().length) {
                    closeNavbarRef.current();
                    setModeRef.current("explore");
                    navigateRef.current("/tutorial", { replace: true });
                    }
                } else {
                    playMoveRef.current();
                    setConfirmDelete("none");
                    setSelectedIndex(0);
                }
                return;
                }

                const item = items[idx];
                if (!item) return;

                playSelectRef.current();

                if (item.key.startsWith("slot-") && item.slot !== undefined) {
                const slot = item.slot;
                if (!isSlotUsed(slot)) return;
                if (slot === getActiveSlot()) return;
                const targetSave = loadGameForSlot(slot);
                if (!targetSave) return;
                setActiveSlot(slot);
                closeNavbarRef.current();
                setModeRef.current("explore");
                navigateRef.current(targetSave.lastRoute, { replace: true });
                }
                else if (item.key.startsWith("delete-") && item.slot !== undefined) {
                if (!isSlotUsed(item.slot)) return;
                    setConfirmDelete({ slot: item.slot });
                    setSelectedIndex(0);
                }
                else if (item.key === "newGame") {
                    const free = getAvailableSlots()[0];
                    if (free === undefined) return;
                        setActiveSlot(free);
                        clearSlot(free);
                        closeNavbarRef.current();
                        setModeRef.current("explore");
                        navigateRef.current("/tutorial", { replace: true });
                } else if (item.key === "back") {
                    closeNavbarRef.current();
                    setModeRef.current("explore");
                }
            },
            onCancel: () => {
                if (confirmDelete !== "none") {
                    setConfirmDelete("none");
                    setSelectedIndex(0);
                    return;
                }
                closeNavbarRef.current();
                setModeRef.current("explore");
            },
            blockGlobalOpen: true,
        });

        return () => popControls();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, confirmDelete, pushControls, popControls]);

    return { confirmDelete, selectedIndex, items, activeSlot };
}