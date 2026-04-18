import { usePlayer } from "@/contexts/PlayerContext";
import styles from "./styles.module.css";
import { useEffect, useRef, useState } from "react";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useNavbar } from "@/contexts/NavbarContext";

export function Character() {

  const characters = [
    { name: "Marcelo", image: "marcelo" },
    { name: "Eduarda", image: "eduarda" },
    { name: "Samuel", image: "samuel" },
    { name: "Artur", image: "artur" },
    { name: "Emanuel", image: "emanuel" },
    { name: "Larissa", image: "larissa" },
    { name: "Mayra", image: "mayra" },
    { name: "Camilly", image: "camilly" },
    { name: "Lucas", image: "lucas" },
    { name: "Lucaua", image: "lucaua" },
    { name: "Riquelme", image: "riquelme" },
  ];

  const { setCharacter, setMode } = usePlayer();
  const selectable = ["Marcelo", "Eduarda"];
  const { closeNavbar } = useNavbar();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [showCharacterChoice, setShowCharacterChoice] = useState(false);

  const selectableCharacters = characters.filter((c) =>
    selectable.includes(c.name)
  );

  const handleChooseCharacter = (selected: "marcelo" | "eduarda") => {
    setCharacter(selected); // 🔥 salva no contexto global
    setShowCharacterChoice(false);
  };

  const { pushControls, popControls } = useGameControls();

  const selectedIndexRef = useRef(selectedIndex);

  useEffect(() => {
    selectedIndexRef.current = selectedIndex;
  }, [selectedIndex]);

  useEffect(() => {
    const controls = {
      onConfirm: () => {
        const selected = selectableCharacters[selectedIndexRef.current];
        handleChooseCharacter(selected.image as "marcelo" | "eduarda");
      },

      onCancel: () => {
        closeNavbar();     // fecha a navbar
        setMode("explore"); // volta pro jogo
      },

      blockGlobalOpen: true,
    };

    pushControls(controls);
    return () => popControls();
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowRight" || e.key === "d") {
        setSelectedIndex((prev) =>
          prev === selectableCharacters.length - 1 ? 0 : prev + 1
        );
      }

      if (e.key === "ArrowLeft" || e.key === "a") {
        setSelectedIndex((prev) =>
          prev === 0 ? selectableCharacters.length - 1 : prev - 1
        );
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className={styles.container}>
      <h3 className={styles.characterTitle}>Personagem</h3>

      <div className={styles.charactersContainer}>
        {characters.map((char) => {
          const isAllowed =
            char.name === "Marcelo" || char.name === "Eduarda";

          const selectableIndex = selectableCharacters.findIndex(
            (c) => c.name === char.name
          );

          const isSelected = selectableIndex === selectedIndex;

          return (
            <div
              key={char.name}
              className={`${styles.character} ${
                !isAllowed ? styles.characterDisabled : ""
              } ${isSelected ? styles.selected : ""}`}
            >
              {isSelected && <span className={styles.cursor}>▼</span>}
              <img
                src={`/src/assets/player/${char.image}/default.svg`}
                className={styles.characterImage}
              />
              <h2>{char.name}</h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}