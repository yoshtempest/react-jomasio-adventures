import styles from "./styles.module.css";
import { useCharacterMenu } from "@/hooks/menu/useCharacterMenu";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";

export function Character() {
  const { progress, getXPToNextLevel } = useCharacterProgress();
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
          const charProgress = progress[char.image];
          const xpNeeded = getXPToNextLevel(charProgress.level);
          const percent = (charProgress.xp / xpNeeded) * 100;

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

              <h2>{char.name} - Nv.{charProgress.level}</h2>
              
              <div className={styles.xpBar}>
                <div
                  className={styles.xpFill}
                  style={{ width: `${percent}%` }}
                />
              </div>

              <p>
                {charProgress.xp} / {xpNeeded} XP
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}