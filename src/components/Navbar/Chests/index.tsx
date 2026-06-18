import { useEffect, useRef, useState } from "react";
import { useInventory } from "@/contexts/InventoryContext";
import { useChestOpening } from "@/hooks/useChestOpening";
import { useGameControls } from "@/contexts/GameControlsContext";
import { RANK_COLORS, RANK_LABELS, SLOT_LABELS } from "@/utils/types/player/equipment";
import type { EquipmentRank, EquipmentSlot } from "@/utils/types/player/equipment";
import styles from "./styles.module.css";

export function Chests() {
  const { items } = useInventory();
  const { openPlayerChest, lastResult, setLastResult } = useChestOpening();
  const { pushControls, popControls } = useGameControls();

  const chestItems = items.filter((i) => i.id.endsWith("_chest"));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    const chests = items.filter((i) => i.id.endsWith("_chest"));
    const count = chests.length;

    const controls = {
      onUp: () => {
        if (lastResult) return;
        setSelectedIndex((prev) =>
          count === 0 ? 0 : (prev - 1 + count) % count,
        );
      },
      onDown: () => {
        if (lastResult) return;
        setSelectedIndex((prev) => (count === 0 ? 0 : (prev + 1) % count));
      },
      onConfirm: () => {
        if (lastResult) {
          setLastResult(null);
          return;
        }
        const chest = chests[selectedIndexRef.current];
        if (!chest) return;
        openPlayerChest(chest.id as ItemId);
      },
      blockGlobalOpen: true,
    };

    pushControls(controls);
    return () => popControls();
  }, [items, lastResult, setLastResult, openPlayerChest, pushControls, popControls]);

  function handleOpen() {
    const chest = chestItems[selectedIndex];
    if (!chest) return;
    openPlayerChest(chest.id as ItemId);
  }

  function handleCloseResult() {
    setLastResult(null);
  }

  if (lastResult) {
    return (
      <div className="containerOfNavbar">
        <h3>Baú Aberto!</h3>

        {lastResult.materials.length > 0 && (
          <div className={styles.section}>
            <h4>Materiais</h4>
            {lastResult.materials.map((m) => (
              <div key={m.id} className={styles.dropRow}>
                <span>{m.name}</span>
                <span className={styles.qty}>x{m.qty}</span>
              </div>
            ))}
          </div>
        )}

        {lastResult.equipment.length > 0 && (
          <div className={styles.section}>
            <h4>Equipamentos</h4>
            {lastResult.equipment.map((eq) => (
              <div key={eq.id} className={styles.dropRow}>
                <span style={{ color: RANK_COLORS[eq.rank as EquipmentRank] }}>
                  [{RANK_LABELS[eq.rank as EquipmentRank]}]
                </span>
                <span>{eq.name}</span>
                <span className={styles.slot}>({SLOT_LABELS[eq.slot as EquipmentSlot]})</span>
                {eq.enhance > 0 && <span className={styles.enhance}>+{eq.enhance}</span>}
              </div>
            ))}
          </div>
        )}

        <button className={styles.button} onClick={handleCloseResult}>
          Fechar
        </button>
      </div>
    );
  }

  if (chestItems.length === 0) {
    return (
      <div className="containerOfNavbar">
        <h3>Baús</h3>
        <p className={styles.empty}>Nenhum baú no inventário.</p>
      </div>
    );
  }

  return (
    <div className="containerOfNavbar">
      <h3>Baús</h3>
      <p className={styles.hint}>Selecione um baú para abrir (requer chave do mesmo tipo)</p>

      <ul className={styles.list}>
        {chestItems.map((chest, index) => {
          const tier = chest.id.replace("_chest", "") as NPCClass;
          const keyId = `${tier}_key` as ItemId;
          const hasKey = items.some((i) => i.id === keyId);

          return (
            <li
              key={chest.id}
              className={`${styles.item} ${index === selectedIndex ? styles.active : ""}`}
              onClick={() => setSelectedIndex(index)}
            >
              <span className={styles.chestIcon}>📦</span>
              <div>
                <span className={styles.chestName}>{chest.name}</span>
                <span className={styles.qty}>x{chest.qty ?? 1}</span>
                {!hasKey && (
                  <span className={styles.noKey}>Sem chave</span>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <button
        className={styles.button}
        disabled={chestItems.length === 0}
        onClick={handleOpen}
      >
        Abrir baú selecionado
      </button>
    </div>
  );
}
