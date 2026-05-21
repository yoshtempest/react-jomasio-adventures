import { useInventory } from "@/contexts/InventoryContext";
import { useInventoryMenu } from "@/hooks/menu/useInventoryMenu";
import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";

export function Inventory() {
  const { items } = useInventory();
  const { coins } = usePlayer();
  const { selectedIndex } = useInventoryMenu(true);

  return (
    <div className={styles.inventory}>
      <h3>Inventário</h3>
      <span>{coins} Kwanzas</span>

      <ul>
        {items.map((item, index) => ( 
          <li
            key={item.id}
            className=
            {index === selectedIndex ? "active" : ""}
            >
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
}