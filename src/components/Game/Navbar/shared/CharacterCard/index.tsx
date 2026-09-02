import styles from "./styles.module.css";
import { ProgressBar } from "@/components/Game/ProgressBar";
import { playerPath, asset } from "@/utils/paths";
import { getRank, formatRank, srcRank } from "@/gameRules/rank";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { getXPToNextLevel } from "@/utils/character/progress";
import { characterFaceStyle } from "@/utils/character/elementFace";
import type { CharacterOption } from "@/utils/types/player/character";

type CharacterProgress = {
  xp: number;
  level: number;
};

type CharacterCardProps = {
  character: CharacterOption & { unlockedDate?: string | null };
  isSelected: boolean;
  progress: CharacterProgress;
  showUnlockDate?: boolean;
  showInUse?: boolean;
  inUse?: boolean;
};

export function CharacterCard({
  character,
  isSelected,
  progress,
  showUnlockDate = false,
  showInUse = false,
  inUse = false,
}: CharacterCardProps) {
  const xpNeeded = getXPToNextLevel(progress.level);

  return (
    <div
      className={`${styles.character} ${
        !character.selectable ? styles.characterDisabled : ""
      } ${isSelected ? styles.selected : ""}`}
    >
      {isSelected && <span className={`cursor ${styles.cursor}`}>▼</span>}

      <div
        className={styles.imageFrame}
        style={characterFaceStyle(character.image)}
      >
        <img
          src={playerPath(`/${character.image}/default.svg`)}
          className={styles.characterImage}
          alt={character.name}
        />
      </div>
      <div className={styles.flexColumn}>
        <h2 className={styles.text}>
          <span className={styles.levelRow}>
            {character.selectable
              ? `${character.name} - Nv.${progress.level}`
              : "???"}
            {character.selectable &&
              CHARACTER_ELEMENT_TYPES[character.image]?.map((element) => (
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
        {character.selectable && (
          <div className={styles.rankRow}>
            <img
              src={asset(
                `/assets/badges/ranks/${srcRank(getRank(progress.level))}`,
              )}
              className={styles.rankBadge}
            />
            <p className={styles.rank}>{formatRank(getRank(progress.level))}</p>
          </div>
        )}

        <div className={styles.progressContainer}>
          <ProgressBar
            value={progress.xp}
            max={xpNeeded}
            animationId={`char-xp-${character.image}`}
            level={progress.level}
          />
        </div>
        <p className={styles.text}>
          {progress.xp} / {xpNeeded} XP
        </p>
        {showUnlockDate && (
          <p className={styles.text}>
            Desbloqueado em:{" "}
            {character.unlockedDate
              ? new Date(character.unlockedDate).toLocaleDateString("pt-BR")
              : "??/??/????"}
          </p>
        )}
        {showInUse && inUse && <p className={styles.inUse}>Em uso</p>}
      </div>
    </div>
  );
}
