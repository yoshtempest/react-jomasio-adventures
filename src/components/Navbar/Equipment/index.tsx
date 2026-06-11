import { useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useEquipmentMenu } from "@/hooks/menu/useEquipmentMenu";
import { EQUIPPED_COUNT, FILTER_TAB_COUNT, FILTER_TABS, FILTER_LABELS } from "@/data/equipmentMenu";
import { asset } from "@/utils/asset";
import {
  SLOT_LABELS,
  RANK_COLORS,
} from "@/utils/types/player/equipment";
import styles from "./styles.module.css";

export function Equipment() {
  const { player } = usePlayer();
  const { getQuantity } = useEquipment();
  const character = player.character;
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightItemsRef = useRef<HTMLDivElement | null>(null);
  const { selectedIndex, equippedItems, filteredItems, filter } =
    useEquipmentMenu(true, character, rightItemsRef);

  return (
    <div className="containerOfNavbar">
      <div className={styles.layout}>
        <div className={styles.leftPanel}>
          <img
            src={asset(`/assets/player/${character}/face.svg`)}
            alt={character}
            className={styles.portrait}
          />

          <div className={styles.equippedGrid} ref={leftPanelRef}>
            {equippedItems.map((entry, index) => {
              const isSelected = index === selectedIndex;

              return (
                <div
                  key={`slot-${entry.slot}`}
                  className={`${styles.equippedCard} ${isSelected ? styles.selected : ""}`}
                >
                  <div className={styles.slotLabel}>
                    {SLOT_LABELS[entry.slot]}
                  </div>
                  {entry.item ? (
                    <>
                      <div className={styles.itemRow}>
                        <span
                          className={styles.itemName}
                          style={{ color: RANK_COLORS[entry.item.rank] }}
                        >
                          {entry.item.name}
                        </span>
                        {(() => {
                          const extra = getQuantity(character, entry.item.id);
                          return extra > 0 ? (
                            <span className={styles.qtyBadge}>x{extra + 1}</span>
                          ) : null;
                        })()}
                      </div>
                      <span className={styles.stats}>
                        HP: +{entry.item.stats.hp} | Força: +{entry.item.stats.strength}
                        {entry.item.stats.intelligence > 0
                          ? ` | Int: +${entry.item.stats.intelligence}`
                          : ""}
                      </span>
                      <span className={styles.actionHint}>
                        Confirmar: Remover
                      </span>
                    </>
                  ) : (
                    <span className={styles.emptySlot}>Vazio</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.filterTabs}>
            {FILTER_TABS.map((tab, i) => {
              const globalIndex = EQUIPPED_COUNT + i;
              const isSelected = globalIndex === selectedIndex;
              const isActive = tab === filter;

              return (
                <div
                  key={tab}
                  className={`${styles.filterTab} ${isActive ? styles.filterTabActive : ""} ${isSelected ? styles.selected : ""}`}
                >
                  {FILTER_LABELS[tab]}
                </div>
              );
            })}
          </div>

          <div className={styles.itemsContainer} ref={rightItemsRef}>
            {filteredItems.length === 0 && (
              <div className={styles.emptyText}>
                Nenhum equipamento encontrado.
              </div>
            )}

            {filteredItems.map((entry, index) => {
              const globalIndex = EQUIPPED_COUNT + FILTER_TAB_COUNT + index;
              const isSelected = globalIndex === selectedIndex;

              return (
                <div
                  key={`collected-${entry.item.id}`}
                  className={`${styles.collectedCard} ${isSelected ? styles.selected : ""}`}
                >
                  <div className={styles.itemRow}>
                    <span
                      className={styles.itemName}
                      style={{ color: RANK_COLORS[entry.item.rank] }}
                    >
                      {entry.item.name}
                    </span>
                    <span className={styles.qtyBadge}>x{entry.qty}</span>
                    <span className={styles.slotTag}>
                      {SLOT_LABELS[entry.item.slot]}
                    </span>
                  </div>
                  <span className={styles.stats}>
                    HP: +{entry.item.stats.hp} | Força: +{entry.item.stats.strength}
                    {entry.item.stats.intelligence > 0
                      ? ` | Int: +${entry.item.stats.intelligence}`
                      : ""}
                  </span>
                  <span className={styles.actionHint}>
                    Confirmar: Equipar
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
