import styles from "./styles.module.css";
import { ProgressBar } from "@/components/Game/ProgressBar";
import { playerPath, asset } from "@/utils/paths";
import { getRank, formatRank, srcRank } from "@/gameRules/rank";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { usePlayer } from "@/contexts/PlayerContext";
import { getXPToNextLevel } from "@/utils/character/progress";
import type { CharacterOption } from "@/utils/types/player/character";

type CharacterProgress = {
  xp: number;
  level: number;
};

type CharacterCardProps = {
  character: CharacterOption;
  isSelected: boolean;
  progress: CharacterProgress;
  /** Abre a lista de habilidades deste personagem. */
  onShowAbilities?: (characterId: CharacterId) => void;
};

export function CharacterCard({
  character,
  isSelected,
  progress,
  onShowAbilities,
}: CharacterCardProps) {
  const { player } = usePlayer();
  const isEquipped = player.character === character.image;
  const xpNeeded = getXPToNextLevel(progress.level);

  return (
    <div
      className={`${styles.character} ${
        !character.selectable ? styles.characterDisabled : ""
      } ${isSelected ? styles.selected : ""}`}
    >
      {isSelected && <span className={`cursor ${styles.cursor}`}>▼</span>}

      <img
        src={playerPath(`/${character.image}/expressions/default.svg`)}
        className={styles.characterImage}
        alt={character.name}
      />
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
        {isEquipped && <p className={styles.inUse}>Em uso</p>}
        {onShowAbilities && character.selectable && (
          <button onClick={() => onShowAbilities(character.image)}>
            Habilidades
          </button>
        )}
      </div>
    </div>
  );
}
