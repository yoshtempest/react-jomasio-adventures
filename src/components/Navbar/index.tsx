import styles from "./styles.module.css";
import { useNavbarMenu } from "@/hooks/useNavbarMenu";

import { Inventory } from "./Inventory";
import { Character } from "./Character";
import { Config } from "./Config";

export function Navbar() {
  const { screen, selectedIndex, options } = useNavbarMenu();

  return (
    <nav className={styles.navbar}>
      {screen === "menu" && (
        <ul className={styles.list}>
          {options.map((item, index) => (
            <li
              key={item.label}
              className={`${styles.item} ${
                selectedIndex === index ? styles.active : ""
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}

      {screen === "inventory" && <Inventory />}
      {screen === "character" && <Character />}
      {screen === "config" && <Config />}
    </nav>
  );
}