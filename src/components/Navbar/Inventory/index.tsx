import { useInventory } from "@/contexts/InventoryContext";
import { useInventoryMenu } from "@/hooks/menu/useInventoryMenu";
import { usePlayer } from "@/contexts/PlayerContext";

export function Inventory() {
  const { items } = useInventory();
  const { coins } = usePlayer();
  const { selectedIndex } = useInventoryMenu(true);

  return (
    <div className="containerOfNavbar">
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
            {item.qty && item.qty > 1 && <span style={{ color: "#888", marginLeft: 6 }}>x{item.qty}</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}