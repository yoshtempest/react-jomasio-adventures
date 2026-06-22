import styles from "./styles.module.css";
import { asset } from "@/utils/asset";
import { getOutroLine } from "@/data/battle/outro";

type Props = {
  character: string;
  type: "victory" | "defeat";
};

export function BattleOutro({ character, type }: Props) {
  const title = type === "victory" ? "Vitória" : "Derrota";

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        <img
          className={styles.sprite}
          src={asset(`/assets/player/${character}/default.svg`)}
          alt={character}
        />

        <div className={styles.speechBubble}>
          <div className={`${styles.title} ${styles[type]}`}>
            {title}
          </div>
          <div className={styles.text}>
            {getOutroLine(character, type)}
          </div>
        </div>
      </div>
    </div>
  );
}
