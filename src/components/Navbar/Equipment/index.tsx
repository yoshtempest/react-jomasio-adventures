import { useRef } from "react";
import { Lock, ArrowUp, ArrowDown } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipmentMenu } from "@/hooks/menu/equipment/useEquipment";
import type { CollectedEntry } from "@/hooks/menu/equipment/useEquipment";
import {
  EQUIPPED_COUNT,
  FILTER_TAB_COUNT,
  FILTER_TABS,
  FILTER_LABELS,
} from "@/utils/equipmentMenu";
import { asset } from "@/utils/asset";
import { SLOT_LABELS, RANK_COLORS } from "@/utils/types/player/equipment";
import styles from "./styles.module.css";

export function Equipment() {
  const { player } = usePlayer();
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
              const info = entry.info;
              const item = entry.item;

              const label = entry.type === "accessory-slot"
                ? `Acessório ${entry.index + 1}`
                : SLOT_LABELS[entry.slot];

              const key = entry.type === "accessory-slot"
                ? `acc-${entry.index}`
                : `slot-${entry.slot}`;

              if (entry.type === "accessory-slot" && entry.locked) {
                return (
                  <div
                    key={key}
                    className={`${styles.equippedCard} ${styles.lockedCard}`}
                  >
                    <div className={styles.chainLeft} />
                    <Lock size={14} className={styles.lockIcon} />
                    <div className={styles.slotLabel}>{label}</div>
                    <div className={styles.chainRight} />
                  </div>
                );
              }

              return (
                <div
                  key={key}
                  className={`${styles.equippedCard} ${isSelected ? styles.selected : ""}`}
                >
                  <div className={styles.slotLabel}>
                    {label}
                  </div>
                  {item ? (
                    <>
                      <div className={styles.itemRow}>
                        <span
                          className={styles.itemName}
                          style={{ color: RANK_COLORS[item.rank] }}
                        >
                          {item.name}
                          {info && info.enhance > 0 ? (
                            <span className={styles.enhanceBadge}>
                              +{info.enhance}
                            </span>
                          ) : null}
                        </span>
                      </div>

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

            {filteredItems.map((entry: CollectedEntry, index) => {
              const globalIndex = EQUIPPED_COUNT + FILTER_TAB_COUNT + index;
              const isSelected = globalIndex === selectedIndex;

              return (
                <div
                  key={`collected-${entry.item.id}+${entry.enhance}`}
                  className={`${styles.collectedCard} ${isSelected ? styles.selected : ""}`}
                >
                  <div className={styles.itemRow}>
                    {entry.arrow === "up" && (
                      <ArrowUp size={14} className={styles.arrowUp} />
                    )}
                    {entry.arrow === "down" && (
                      <ArrowDown size={14} className={styles.arrowDown} />
                    )}
                    <span
                      className={styles.itemName}
                      style={{ color: RANK_COLORS[entry.item.rank] }}
                    >
                      {entry.item.name}
                      {entry.enhance > 0 ? (
                        <span className={styles.enhanceBadge}>
                          +{entry.enhance}
                        </span>
                      ) : null}
                    </span>
                    <span className={styles.qtyBadge}>x{entry.qty}</span>
                    <span className={styles.slotTag}>
                      {SLOT_LABELS[entry.item.slot]}
                    </span>
                  </div>
                  <span className={styles.stats}>
                    HP: +{entry.stats.hp} | For: +{entry.stats.strength}
                    {entry.stats.intelligence > 0
                      ? ` | Int: +${entry.stats.intelligence}`
                      : ""}
                    {entry.stats.armor > 0
                      ? ` | Arm: +${entry.stats.armor}`
                      : ""}
                  </span>
                  <span className={styles.actionHint}>Confirmar: Equipar</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
