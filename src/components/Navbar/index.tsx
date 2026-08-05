import styles from "./styles.module.css";
import { useNavbarMenu } from "@/hooks/menu/useNavbar";
import { useNavbar } from "@/contexts/NavbarContext";

import { Status } from "./Status";
import { Inventory } from "./Inventory";
import { Character } from "./Character";
import { Config } from "./Config";
import { Mission } from "./Missions";
import { Equipment } from "./Equipment";
import { TitlesScreen } from "./Titles";
import { DeliciaDex } from "./Bestiary";
import { Player } from "./Player";
import { Saves } from "./Saves";
import { Professions } from "./Professions";
import { Pets } from "./Pets";
import { asset } from "@/utils/paths";

export function Navbar() {
  const { screen, selectedIndex, options } = useNavbarMenu();
  const { isClosing } = useNavbar();

  if (screen === "menu") {
    return (
      <nav className={`${styles.navbar} ${isClosing ? styles.closing : ""}`}>
        <ul className={styles.list}>
          {options.map((item, index) => (
            <li
              key={item.label}
              className={`${styles.item} ${
                selectedIndex === index ? "active" : ""
              }`}
            >
              <img className={styles.icon} src={asset(item.icon)} />
              {item.label}
            </li>
          ))}
        </ul>
      </nav>
    );
  }

  return (
    <div className={isClosing ? styles.closing : undefined}>
      {screen === "status" && <Status />}
      {screen === "character" && <Character />}
      {screen === "inventory" && <Inventory />}
      {screen === "config" && <Config />}
      {screen === "missions" && <Mission />}
      {screen === "equipment" && <Equipment />}
      {screen === "titles" && <TitlesScreen />}
      {screen === "bestiary" && <DeliciaDex />}
      {screen === "player" && <Player />}
      {screen === "saves" && <Saves />}
      {screen === "professions" && <Professions />}
      {screen === "pets" && <Pets />}
    </div>
  );
}
