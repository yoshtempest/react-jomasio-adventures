import { useRef } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useEquipmentMenu } from "@/hooks/menu/useEquipmentMenu";
import { asset } from "@/utils/asset";
import {
  SLOT_LABELS,
  RANK_LABELS,
  RANK_COLORS,
} from "@/utils/types/player/equipment";
import styles from "./styles.module.css";

const EQUIPPED_COUNT = 4;

export function Equipment() {
  const { player } = usePlayer();
  const character = player.character;
  const leftPanelRef = useRef<HTMLDivElement | null>(null);
  const rightPanelRef = useRef<HTMLDivElement | null>(null);
  const { selectedIndex, equippedItems, collectedItems } = useEquipmentMenu(
    true,
    character,
    leftPanelRef,
    rightPanelRef
  );

  return (
    <div className="containerOfNavbar">
      <h2>Equipamentos</h2>

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
                      <span
                        className={styles.itemName}
                        style={{ color: RANK_COLORS[entry.item.rank] }}
                      >
                        {entry.item.name}
                      </span>
                      <span className={styles.stats}>
                        {RANK_LABELS[entry.item.rank]} — HP: +{entry.item.stats.hp} | Força: +{entry.item.stats.strength}
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

        <div className={styles.rightPanel} ref={rightPanelRef}>
          {collectedItems.length === 0 && (
            <div className={styles.emptyText}>
              Nenhum equipamento coletado ainda.
            </div>
          )}

          {collectedItems.map((entry, index) => {
            const globalIndex = EQUIPPED_COUNT + index;
            const isSelected = globalIndex === selectedIndex;

            return (
              <div
                key={`collected-${entry.item.id}`}
                className={`${styles.collectedCard} ${isSelected ? styles.selected : ""}`}
              >
                <div className={styles.collectedHeader}>
                  <span
                    className={styles.itemName}
                    style={{ color: RANK_COLORS[entry.item.rank] }}
                  >
                    {entry.item.name}
                  </span>
                  <span className={styles.slotTag}>
                    {SLOT_LABELS[entry.item.slot]}
                  </span>
                </div>
                <span className={styles.rankLabel}>
                  {RANK_LABELS[entry.item.rank]}
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
  );
}
