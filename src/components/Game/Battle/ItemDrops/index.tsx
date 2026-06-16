import styles from "./styles.module.css";
import type { ItemDropInfo } from "@/hooks/battle/useBattleRewards";

type Props = {
  itemDrops: ItemDropInfo[];
};

export function ItemDrops({ itemDrops }: Props) {
  if (itemDrops.length === 0) return null;

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>Itens Coletados</h2>
      <div className={styles.dropsList}>
        {itemDrops.map((item) => (
          <div key={item.id} className={styles.dropItem}>
            <img
              className={styles.dropIcon}
              src={
                item.image
                  ? `${import.meta.env.BASE_URL}${item.image.replace(/^\//, "")}`
                  : `${import.meta.env.BASE_URL}assets/items/${item.id}.svg`
              }
              alt={item.name}
            />
            <span className={styles.dropName}>{item.name}</span>
            <span className={styles.dropQty}>x{item.qty}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
