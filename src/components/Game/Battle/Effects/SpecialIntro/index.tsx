import { useState } from "react";
import { playerPath } from "@/utils/paths";
import styles from "./styles.module.css";

type Props = {
  active: boolean;
  character: string | null;
};

export function SpecialIntro({ active, character }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  if (!active || !character) return null;

  return (
    <div className={styles.overlay} role="presentation">
      <div className={styles.flash} />

      <div className={styles.topMotion}>
        <div className={`${styles.streak} ${styles.streakOne}`} />
        <div className={`${styles.streak} ${styles.streakTwo}`} />
        <div className={`${styles.streak} ${styles.streakThree}`} />
      </div>
      {!imageFailed && (
        // <img
        //   className={styles.image}
        //   src={playerPath(`/${character}/specialBackground.svg`)}
        //   alt=""
        //   onError={() => setImageFailed(true)}
        // />
        <div className={styles.characterContainer}>
          <img
            src={playerPath(`/${character}/specialBackground.svg`)}
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
