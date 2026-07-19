import { useInventory } from "@/contexts/InventoryContext";
import { useDailyChest } from "@/hooks/useDailyChest";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { CHARACTERS } from "@/utils/types/player/player";
import styles from "./styles.module.css";
import { asset } from "@/utils/paths";
import { formatDurationHms } from "@/utils/formatDuration";

export function Chest() {
  const { items, maxSlots } = useInventory();
  const dailyChest = useDailyChest();
  const { progress } = useCharacterProgress();

  const totalCoins = CHARACTERS.reduce(
    (sum, c) => sum + (progress[c]?.coins ?? 0),
    0,
  );
  const totalHyperCoins = CHARACTERS.reduce(
    (sum, c) => sum + (progress[c]?.hyperCoins ?? 0),
    0,
  );
  const currencyCount =
    (totalCoins > 0 ? 1 : 0) + (totalHyperCoins > 0 ? 1 : 0);
  const totalUsed = items.length + currencyCount;

  const slotsLabel =
    maxSlots === Infinity ? `${totalUsed} / ∞` : `${totalUsed} / ${maxSlots}`;

  return (
    <div className={styles.flexRow}>
      <h3>Inventário {slotsLabel}</h3>
      <div className={styles.dailyChest}>
        <div className={styles.dailyChestInfo}>
          <img
            className={styles.image}
            src={asset("/assets/items/chests/default.svg")}
          />
          <span className={styles.dailyChestTitle}>
            Baú Diário -{" "}
            {dailyChest.isReady ? (
              <span className={styles.dailyChestReady}>Disponível!</span>
            ) : (
              <span className={styles.dailyChestTimer}>
                {formatDurationHms(dailyChest.timeLeft)}
              </span>
            )}
          </span>
        </div>
        {dailyChest.isReady && (
          <button className="dailyButton" onClick={() => dailyChest.open()}>
            Abrir
          </button>
        )}
      </div>
    </div>
  );
}
