import { useEquipment } from "@/contexts/EquipmentContext";
import { getEquipmentById } from "@/data/equipment";
import {
  EQUIPMENT_SLOTS,
  SLOT_LABELS,
  RANK_LABELS,
  RANK_COLORS,
} from "@/utils/types/player/equipment";
import styles from "./styles.module.css";

export function Equipment() {
  const { equipped, collection, equip, unequip, getEquippedItem } = useEquipment();

  function handleEquip(id: EquipmentId) {
    const item = getEquipmentById(id);
    if (!item) return;

    const current = getEquippedItem(item.slot);
    if (current && current.id !== id) {
      unequip(item.slot);
    }

    equip(id);
  }

  return (
    <div className="containerOfNavbar">
      <h2>Equipamentos</h2>

      <div className={styles.grid}>
        {EQUIPMENT_SLOTS.map((slot) => {
          const item = getEquippedItem(slot);

          return (
            <div key={slot} className={styles.slotCard}>
              <div className={styles.slotLabel}>{SLOT_LABELS[slot]}</div>

              {item ? (
                <div className={styles.equippedItem}>
                  <span
                    className={styles.itemName}
                    style={{ color: RANK_COLORS[item.rank] }}
                  >
                    {item.name}
                  </span>
                  <span className={styles.itemStats}>
                    {RANK_LABELS[item.rank]} —
                    HP: +{item.stats.hp} | Força: +{item.stats.strength}
                    {item.stats.intelligence > 0
                      ? ` | Int: +${item.stats.intelligence}`
                      : ""}
                  </span>
                  <button
                    className={styles.equipButton}
                    onClick={() => unequip(slot)}
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <div className={styles.emptySlot}>Vazio</div>
              )}
            </div>
          );
        })}
      </div>

      <div className={styles.collection}>
        <div className={styles.collectionTitle}>Itens Coletados</div>

        {collection.length === 0 && (
          <div className={styles.emptyText}>
            Nenhum equipamento coletado ainda. Derrote NPCs para conseguir!
          </div>
        )}

        {collection.map((id) => {
          const item = getEquipmentById(id);
          if (!item) return null;

          const isEquipped = equipped[item.slot] === id;

          return (
            <div key={id} className={styles.collectionItem}>
              <div>
                <span
                  className={styles.collectionItemName}
                  style={{ color: RANK_COLORS[item.rank] }}
                >
                  {item.name}
                </span>
                <span className={styles.collectionItemSlot}>
                  {" "}
                  ({SLOT_LABELS[item.slot]} — {RANK_LABELS[item.rank]})
                </span>
              </div>

              {!isEquipped && (
                <button
                  className={styles.equipButton}
                  onClick={() => handleEquip(id)}
                >
                  Equipar
                </button>
              )}

              {isEquipped && (
                <span style={{ fontSize: 12, color: "#4ade80" }}>
                  Equipado
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
