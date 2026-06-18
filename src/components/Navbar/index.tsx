import styles from "./styles.module.css";
import { useNavbarMenu } from "@/hooks/menu/useNavbar";

import { Status } from "./Status";
import { Inventory } from "./Inventory";
import { Character } from "./Character";
import { Config } from "./Config";
import { Mission } from "./Missions";
import { Equipment } from "./Equipment";
import { TitlesScreen } from "./Titles";
import { Chests } from "./Chests";

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
                selectedIndex === index ? "active" : ""
              }`}
            >
              {item.label}
            </li>
          ))}
        </ul>
      )}

      {screen === "status" && <Status />}
      {screen === "character" && <Character />}
      {screen === "inventory" && <Inventory />}
      {screen === "config" && <Config />}
      {screen === "missions" && <Mission />}
      {screen === "equipment" && <Equipment />}
      {screen === "titles" && <TitlesScreen />}
      {screen === "chests" && <Chests />}
    </nav>
  );
}
