import { useRef } from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipmentMenu } from "@/hooks/menu/equipment/useEquipment";
import type { CollectedEntry } from "@/utils/types/equipment/entrys";
import {
  EQUIPPED_COUNT,
  FILTER_TAB_COUNT,
  FILTER_TABS,
  FILTER_LABELS,
} from "@/utils/equipmentMenu";
import { SLOT_LABELS, RANK_COLORS, RANK_LABELS } from "@/utils/types/player/equipment";
import styles from "./styles.module.css";
import { asset } from "@/utils/asset";

export function RightPanel() {
  const { player } = usePlayer();
  const character = player.character;
  const rightItemsRef = useRef<HTMLDivElement | null>(null);
  const { selectedIndex, filteredItems, filter } =
    useEquipmentMenu(true, character, rightItemsRef);

  return (
    <div className={styles.rightPanel}>
      <div className={styles.filterTabs}>
        {FILTER_TABS.map((tab, i) => {
          const globalIndex = EQUIPPED_COUNT + i;
          const isSelected = globalIndex === selectedIndex;
          const isActive = tab === filter;

          return (
            <div
              key={tab}
              className={`${styles.filterTab} ${isActive ? styles.filterTabActive : ""} ${isSelected ? "EquipmentSelected" : ""}`}
            >
              <img className={styles.equipmentImage} src={asset(FILTER_LABELS[tab])}/>
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
              className={`${styles.collectedCard} ${isSelected ? "EquipmentSelected" : ""}`}
            >
              <div className="EquipmentItemRow">
                {entry.arrow === "up" && (
                  <ArrowUp size={14} className={styles.arrowUp} />
                )}
                {entry.arrow === "down" && (
                  <ArrowDown size={14} className={styles.arrowDown} />
                )}
                <span
                  className="EquipmentItemName"
                  style={{ color: RANK_COLORS[entry.item.rank] }}
                >
                  {entry.item.name}
                  {entry.enhance > 0 ? (
                    <span className="EquipmentEnhanceBadge">
                      +{entry.enhance}
                    </span>
                  ) : null}
                </span>
                <span className={styles.qtyBadge}>x{entry.qty}</span>
                <span className={styles.slotTag}>
                  {SLOT_LABELS[entry.item.slot]}
                </span>
                <span
                  className={styles.rankLabel}
                  style={{ color: RANK_COLORS[entry.item.rank] }}
                >
                  {RANK_LABELS[entry.item.rank]}
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
  );
}
