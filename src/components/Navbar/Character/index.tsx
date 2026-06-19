import styles from "./styles.module.css";
import { useCharacterMenu } from "@/hooks/menu/useCharacter";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { asset } from "@/utils/asset";
import { getRank, formatRank } from "@/gameRules/rank";

export function Character() {
  const { progress, getXPToNextLevel } = useCharacterProgress();
  const { characters, selectableCharacters, selectedIndex } =
    useCharacterMenu();

  return (
    <div className="containerOfNavbar">
      <div className={styles.charactersContainer}>
        {characters.map((char) => {
          const selectableIndex = selectableCharacters.findIndex(
            (c) => c.name === char.name,
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
              {isSelected && <span className="cursor">▼</span>}

              <img
                src={asset(`/assets/player/${char.image}/default.svg`)}
                className={styles.characterImage}
              />

              <h2 className={styles.text}>
                {char.name} - Nv.{charProgress.level}
              </h2>
              <p className={styles.rank}>
                {formatRank(getRank(charProgress.level))}
              </p>

              <div className="xpBar">
                <div className="xpFill" style={{ width: `${percent}%` }} />
              </div>

              <p className={styles.text}>
                {charProgress.xp} / {xpNeeded} XP
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
