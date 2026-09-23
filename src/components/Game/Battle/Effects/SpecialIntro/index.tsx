import { useState } from "react";
import { playerPath } from "@/utils/paths";
import styles from "./styles.module.css";

type Props = {
  active: boolean;
  character: string | null;
  /** Habilidade com background próprio (ex: "atomic" → habilities/atomic/background.svg). */
  ability?: string | null;
};

export function SpecialIntro({ active, character, ability = null }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!active || !character) return null;

  const backgroundSrc = ability
    ? playerPath(
        `/${character}/inFight/default/habilities/${ability}/background.svg`,
      )
    : playerPath(`/${character}/specialBackground.svg`);

  return (
    <div className={styles.overlay} role="presentation">
      <div className={styles.flash} />

      <div className={styles.topMotion}>
        <div className={`${styles.streak} ${styles.streakOne}`} />
        <div className={`${styles.streak} ${styles.streakTwo}`} />
        <div className={`${styles.streak} ${styles.streakThree}`} />
      </div>
      {!imageFailed && (
        <div className={styles.characterContainer}>
          <img
            src={backgroundSrc}
            alt=""
            className={styles.character}
            onError={() => setImageFailed(true)}
          />
        </div>
      )}
      <div className={styles.bottomMotion}>
        <div className={`${styles.streak} ${styles.streakOne}`} />
        <div className={`${styles.streak} ${styles.streakTwo}`} />
        <div className={`${styles.streak} ${styles.streakThree}`} />
      </div>
    </div>
  );
}
