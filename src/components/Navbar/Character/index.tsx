import { useRef } from "react";
import styles from "./styles.module.css";
import { useCharacterMenu } from "@/hooks/menu/useCharacter";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { ProgressBar } from "@/components/ProgressBar";
import { playerPath, asset } from "@/utils/paths";
import { getRank, formatRank, srcRank } from "@/gameRules/rank";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";

export function Character() {
  const { progress, getXPToNextLevel } = useCharacterProgress();
  const listRef = useRef<HTMLDivElement>(null);
  const { characters, selectableCharacters, selectedIndex } = useCharacterMenu(
    true,
    listRef,
  );

  return (
    <div
      ref={listRef}
      className={`containerOfNavbar ${styles.charactersContainer}`}
    >
      {characters.map((char) => {
        const selectableIndex = selectableCharacters.findIndex(
          (c) => c.name === char.name,
        );
        const charProgress = progress[char.image];
        const xpNeeded = getXPToNextLevel(charProgress.level);

        const isSelected = selectableIndex === selectedIndex;

        return (
          <div
            key={char.name}
            className={`${styles.character} ${
              !char.selectable ? styles.characterDisabled : ""
            } ${isSelected ? styles.selected : ""}`}
          >
            {isSelected && <span className={`cursor ${styles.cursor}`}>▼</span>}

            <img
              src={playerPath(`/${char.image}/default.svg`)}
              className={styles.characterImage}
            />
            <div className={styles.flexColumn}>
              <h2 className={styles.text}>
                <span className={styles.levelRow}>
                  {char.selectable
                    ? `${char.name} - Nv.${charProgress.level}`
                    : "???"}
                  {char.selectable &&
                    CHARACTER_ELEMENT_TYPES[char.image].map((element) => (
                      <img
                        key={element}
                        src={asset(
                          `/assets/badges/elements/${element.toLowerCase()}.svg`,
                        )}
                        alt={element}
                        title={element}
                        className={styles.elementBadge}
                      />
                    ))}
                </span>
              </h2>
              {char.selectable ?
                <div className={styles.rankRow}>
                  <img
                    src={asset(`/assets/badges/ranks/${srcRank(getRank(charProgress?.level ?? 1))}`)}
                    className={styles.rankBadge}
                  />

                  <p className={styles.rank}>
                    {formatRank(getRank(charProgress.level))}
                  </p>
                </div>

                : ""
              }

              <div className={styles.progressContainer}>
                <ProgressBar
                  value={charProgress.xp}
                  max={xpNeeded}
                  animationId={`char-xp-${char.image}`}
                  level={charProgress.level}
                />
              </div>
              <p className={styles.text}>
                {charProgress.xp} / {xpNeeded} XP
              </p>
              <p className={styles.text}>
                Desbloqueado em:{" "}
                {char.unlockedDate
                  ? new Date(char.unlockedDate).toLocaleDateString("pt-BR")
                  : "??/??/????"}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
