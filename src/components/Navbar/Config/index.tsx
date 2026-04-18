import { useInventory } from "@/contexts/InventoryContext";
import styles from "./styles.module.css";

export function Config() {
  const { items } = useInventory();

  return (
    <div className={styles.inventory}>
      <h3>Configurações</h3>

      <ul>
        {items.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
}