import { useInventory } from "@/contexts/InventoryContext";
import { useInventoryMenu } from "@/hooks/menu/useInventoryMenu";
import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";

export function Inventory() {
  const { items, maxSlots } = useInventory();
  const { coins } = usePlayer();
  const { selectedIndex } = useInventoryMenu(true);

  const slotsLabel = maxSlots === Infinity
    ? `${items.length} / ∞`
    : `${items.length} / ${maxSlots}`;

  return (
    <div className="containerOfNavbar">
      <h3>Inventário</h3>
      <span>{coins} Kwanzas</span>
      <span style={{ display: "block", fontSize: 12, color: "#aaa" }}>
        Slots: {slotsLabel}
      </span>

      <ul className={styles.list}>
        {items.map((item, index) => (
          <li
            key={item.id}
            className={`${styles.item} ${index === selectedIndex ? styles.active : ""}`}
          >
            <div className={styles.itemRow}>
              <img
                className={styles.icon}
                src={`${import.meta.env.BASE_URL}assets/items/${item.id}.svg`}
                alt={item.name}
              />
              <div className={styles.info}>
                <span className={styles.name}>
                  {item.name}
                  {item.qty && item.qty > 1 && (
                    <span className={styles.qty}> x{item.qty}</span>
                  )}
                </span>
                {item.description && (
                  <span className={styles.description}>{item.description}</span>
                )}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
