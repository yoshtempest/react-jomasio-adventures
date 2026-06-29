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
import { loadGameForSlot, getPlayTimeForSlot } from "@/utils/save/saveGame";
import { getSceneImage, getSceneLabel } from "@/utils/sceneImages";
import { formatTime } from "@/contexts/PlayTimeContext";
import styles from "./styles.module.css";

type ConfirmScreen = "none" | { slot: SlotIndex };

type Item = {
  key: string;
  label: string;
  danger?: boolean;
  slot?: SlotIndex;
};

export function Saves() {
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

  const refreshRef = useRef(() => setRefreshKey((k) => k + 1));

  const items = useMemo((): Item[] => {
    const list: Item[] = [];

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

    list.push({ key: "back", label: "Voltar" });

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
        setSelectedIndex((prev) => circularPrev(prev, items.length));
      },
      onDown: () => {
        playMoveRef.current();
        setSelectedIndex((prev) => circularNext(prev, items.length));
      },
      onConfirm: () => {
        if (confirmDelete !== "none") {
          if (selectedIndex === 0) {
            playSelectRef.current();
            clearSlot(confirmDelete.slot);
            if (confirmDelete.slot === getActiveSlot()) {
              const remaining = getUsedSlots();
              if (remaining.length > 0) setActiveSlot(remaining[0]);
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

        const item = items[selectedIndex];
        if (!item) return;

        playSelectRef.current();

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

  if (confirmDelete !== "none") {
    const confirmItems = ["Sim, excluir", "Não, voltar"];
    return (
      <div className={styles.saves}>
        <h2 className={styles.title}>Excluir Save {confirmDelete.slot + 1}?</h2>
        <div className={styles.actionList}>
          {confirmItems.map((label, i) => (
            <div
              key={label}
              className={`${styles.action} ${selectedIndex === i ? styles.selected : ""} ${i === 0 ? styles.actionDanger : ""}`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.saves}>
      <h2 className={styles.title}>Saves</h2>
      <div className={styles.itemList}>
        {items.map((item, i) => {
          const isSelected = selectedIndex === i;
          const isSlot = item.key.startsWith("slot-");

          if (isSlot && item.slot !== undefined) {
            const slot = item.slot;
            const used = isSlotUsed(slot);
            const isActive = slot === activeSlot;
            const save = used ? loadGameForSlot(slot) : null;
            const sceneImage = save?.lastRoute
              ? getSceneImage(save.lastRoute)
              : "/assets/logo.svg";
            const sceneLabel = save?.lastRoute
              ? getSceneLabel(save.lastRoute)
              : "Sem progresso";
            const playTime = used ? getPlayTimeForSlot(slot) : 0;

            return (
              <div
                key={item.key}
                className={`${styles.slotCard} ${isSelected ? styles.selected : ""} ${isActive ? styles.active : ""}`}
              >
                <img src={sceneImage} alt="" className={styles.sceneImage} />
                <div className={styles.slotInfo}>
                  <span className={styles.slotLabel}>
                    Save {slot + 1}
                    {isActive && <span className={styles.activeBadge}> &gt; Ativo</span>}
                  </span>
                  {used ? (
                    <>
                      <span className={styles.sceneLabel}>{sceneLabel}</span>
                      <span className={styles.playTime}>{formatTime(playTime)}</span>
                    </>
                  ) : (
                    <span className={styles.emptyLabel}>Vazio</span>
                  )}
                </div>
              </div>
            );
          }

          return (
            <div
              key={item.key}
              className={`${styles.action} ${isSelected ? styles.selected : ""} ${item.danger ? styles.actionDanger : ""} ${item.key === "back" ? styles.backAction : ""}`}
            >
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}
