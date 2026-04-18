import styles from "./styles.module.css";
import { useCharacterMenu } from "@/hooks/useCharacterMenu";

export function Character() {
  const { characters, selectableCharacters, selectedIndex } =
    useCharacterMenu();

  return (
    <div className={styles.container}>
      <h3 className={styles.characterTitle}>Personagem</h3>

      <div className={styles.charactersContainer}>
        {characters.map((char) => {
          const selectableIndex = selectableCharacters.findIndex(
            (c) => c.name === char.name
          );

          const isSelected = selectableIndex === selectedIndex;

          return (
            <div
              key={char.name}
              className={`${styles.character} ${
                !char.selectable ? styles.characterDisabled : ""
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