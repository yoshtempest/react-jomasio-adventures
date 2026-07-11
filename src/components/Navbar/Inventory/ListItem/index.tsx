import { ITEMS } from "@/data/items";
import type { InventoryItem } from "@/utils/types/player/inventory";
import styles from "./styles.module.css";

type Props = {
  item: InventoryItem;
  isSelected: boolean;
  rejected: boolean;
};

export function ListItem({ item, isSelected, rejected }: Props) {
  const itemData = ITEMS[item.id as keyof typeof ITEMS];

  return (
    <li
      className={`InventoryItem ${isSelected ? "active" : ""} ${rejected ? styles.rejected : ""}`}
    >
      {itemData && (
        <div className={styles.itemRow}>
          <img
            className={styles.icon}
            src={
              itemData.image
                ? `${import.meta.env.BASE_URL}${itemData.image.replace(/^\//, "")}`
                : `${import.meta.env.BASE_URL}assets/items/${item.id}.svg`
            }
            alt={itemData.name}
          />

          <div className={styles.info}>
            <span className={styles.name}>
              {itemData.name}
              {item.qty && item.qty > 0 && (
                <span className="InventoryQty"> x{item.qty}</span>
              )}
            </span>

            {itemData.description && (
              <span className={styles.description}>
                {itemData.description}
              </span>
            )}
          </div>
        </div>
      )}
    </li>
  );
}
