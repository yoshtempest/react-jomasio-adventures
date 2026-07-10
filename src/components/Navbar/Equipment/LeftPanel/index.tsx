import { useRef } from "react";
import { Lock } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { playerPath } from "@/utils/paths";
import { SLOT_LABELS, RANK_COLORS } from "@/utils/types/player/equipment";
import styles from "./styles.module.css";
import { useEquipmentMenu } from "@/hooks/menu/equipment/useEquipment";

export function LeftPanel() {
  const { player } = usePlayer();
  const character = player.character;
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightItemsRef = useRef<HTMLDivElement | null>(null);
  const { selectedIndex, equippedItems } =
    useEquipmentMenu(true, character, rightItemsRef);

  return (
    <div className={styles.leftPanel}>
      <img
        src={playerPath(`/${character}/face.svg`)}
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
              className={`${styles.equippedCard} ${isSelected ? "EquipmentSelected" : ""}`}
            >
              <div className={styles.slotLabel}>
                {label}
              </div>
              {item ? (
                <>
                  <div className="EquipmentItemRow">
                    <span
                      className="EquipmentItemName"
                      style={{ color: RANK_COLORS[item.rank] }}
                    >
                      {item.name}
                      {info && info.enhance > 0 ? (
                        <span className="EquipmentEnhanceBadge">
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
  );
}
