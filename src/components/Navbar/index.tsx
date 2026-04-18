import { useNavigate } from "react-router";
import styles from "./styles.module.css"
import { useEffect, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useNavbar } from "@/contexts/NavbarContext";
import { useGameControls } from "@/contexts/GameControlsContext";

export function Navbar() {
  const { closeNavbar } = useNavbar();
  const { setMode } = usePlayer();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const options = [
    { label: "Personagem", path: "/character" },
    { label: "Mochila", path: "/inventory" },
    { label: "Configurações", path: "/config" },
  ];
  const { setOnConfirm } = useGameControls();
  const navigate = useNavigate();
  useEffect(() => {
  function handleKeyDown(e: KeyboardEvent) {
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
  }, []);

  useEffect(() => {
    setOnConfirm(() => () => {
      const selected = options[selectedIndex];
      navigate(selected.path);

      closeNavbar();
      setMode("explore");
    });

    return () => setOnConfirm(undefined);
  }, [selectedIndex]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "b") {
        closeNavbar();
        setMode("explore");
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
  return (
    <nav id="Navbar" className={styles.navbar}>
      <ul className={styles.list}>
        {options.map((item, index) => (
          <li
            key={item.path}
            className={`${styles.item} ${
              selectedIndex === index ? styles.active : ""
            }`}
          >
            {item.label}
          </li>
        ))}
      </ul>
    </nav>
  )
}