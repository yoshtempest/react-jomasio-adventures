import { useInventory } from "@/contexts/InventoryContext";
import { useInventoryMenu } from "@/hooks/menu/useInventoryMenu";
import styles from "./styles.module.css";

export function Inventory() {
  const { items } = useInventory();
  const { selectedIndex } = useInventoryMenu(true);

  return (
    <div className={styles.inventory}>
      <h3>Inventário</h3>

      <ul>
        {items.map((item, index) => ( 
          <li
            key={item.id}
            className=
            {index === selectedIndex ? styles.active : ""}
            >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}