import styles from "./styles.module.css"
import { useEffect, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { Inventory } from "./Inventory";
import { Character } from "./Character";
import { Config } from "./Config";

type NavScreen = "menu" | "character" | "inventory" | "config";

export function Navbar() {
  const { closeNavbar } = useNavbar();
  const { setMode } = usePlayer();
  const [screen, setScreen] = useState<NavScreen>("menu");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const options = [
    { label: "Personagem", path: "/character" },
    { label: "Mochila", path: "/inventory" },
    { label: "Configurações", path: "/config" },
  ];

  const { setOnConfirm } = useGameControls();

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (screen !== "menu") return
      if (e.key === "ArrowUp" || e.key === "w") {
        setSelectedIndex((prev) =>
          prev === 0 ? options.length - 1 : prev - 1
        );
      }

      if (e.key === "ArrowDown" || e.key === "s") {
        setSelectedIndex((prev) =>
          prev === options.length - 1 ? 0 : prev + 1
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen]);

  useEffect(() => {
    setOnConfirm(() => () => {
      if (screen !== "menu") return;

      const selected = options[selectedIndex];

      if (selected.label === "Personagem") {
        setScreen("character");
      }

      if (selected.label === "Mochila") {
        setScreen("inventory");
      }

      if (selected.label === "Configurações") {
        setScreen("config");
      }
    });

    return () => setOnConfirm(undefined);
  }, [selectedIndex, screen, setOnConfirm]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "b") {
        if (screen !== "menu") {
          setScreen("menu"); // 👈 volta pro menu
          return;
        }

        // 👇 se já estiver no menu
        closeNavbar();
        setMode("explore");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [screen]);
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

    {screen === "inventory" && (
      <Inventory />
    )}

    {screen === "character" && (
      <Character />
    )}

    {screen === "config" && (
      <Config />
    )}
  </nav>
  )
}