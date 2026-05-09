import { asset } from "@/utils/asset";
import styles from "./styles.module.css";

type Props = {
  playerCharacter: string;
  npcType: string;
  onSkip: () => void;
};

export function BattleIntro({
  playerCharacter,
  npcType,
  onSkip,
}: Props) {
  return (
    <div className={styles.overlay}>
      <div className={styles.left}>
        <img
          src={asset(`/assets/player/${playerCharacter}/default.svg`)}
          alt=""
        />
      </div>

      <div className={styles.vs}>
        VS
      </div>

      <div className={styles.right}>
        <img
          src={asset(`/assets/npcs/${npcType}/right.svg`)}
          alt=""
        />
      </div>

      <button className={styles.skip} onClick={onSkip}>
        Pular
      </button>
    </div>
  );
}