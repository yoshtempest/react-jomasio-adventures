import { useInventory } from "@/contexts/InventoryContext";
import { useDailyChest } from "@/hooks/useDailyChest";
import styles from "./styles.module.css";
import { asset } from "@/utils/asset";
import { formatDurationHms } from "@/utils/formatDuration";

export function Chest() {
  const { items, maxSlots } = useInventory();
  const dailyChest = useDailyChest();

  const slotsLabel =
    maxSlots === Infinity
      ? `${items.length} / ∞`
      : `${items.length} / ${maxSlots}`;
    
  return (
    <div className={styles.flexRow}>
      <h3>Inventário {slotsLabel}</h3>
      <div className={styles.dailyChest}>
        <div className={styles.dailyChestInfo}>
          <img className={styles.image} src={asset("/assets/items/chests/default.svg")}/>
          <span className={styles.dailyChestTitle}>Baú Diário - {dailyChest.isReady ? (
            <span className={styles.dailyChestReady}>Disponível!</span>
          ) : (
            <span className={styles.dailyChestTimer}>
              {formatDurationHms(dailyChest.timeLeft)}
            </span>
          )}</span>
        </div>
        {dailyChest.isReady && (
          <button
            className="dailyButton"
            onClick={() => dailyChest.open()}
          >
            Abrir
          </button>
        )}
      </div>
    </div>
  )
}
