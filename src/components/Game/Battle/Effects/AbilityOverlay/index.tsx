import { useEffect, useState } from "react";
import styles from "./styles.module.css";

type Props = {
  active: boolean;
  /** Imagem de fundo exibida centralizada no overlay. */
  src: string | null;
};

/**
 * Overlay de abertura de habilidade (special do jogador, habilidade do alfa).
 * Exibição única: flash, faixas em movimento, streaks e imagem centralizada.
 * Fica acima do fundo da batalha, mas abaixo do jogador/NPCs (renderizado antes
 * do `.SceneMap`). Se a imagem falhar, o único fallback é escondê-la.
 */
export function AbilityOverlay({ active, src }: Props) {
  const [imageFailed, setImageFailed] = useState(false);

  useEffect(() => {
    setImageFailed(false);
  }, [src]);

  if (!active || !src) return null;

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
            src={src}
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