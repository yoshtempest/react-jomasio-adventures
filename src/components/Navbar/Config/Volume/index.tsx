import { Minus, Plus } from "lucide-react";
import styles from "../styles.module.css";

type Props = {
  sfxVolume: number;
  bgmVolume: number;
  selectedColumn: number;
};

export function VolumeSection({ sfxVolume, bgmVolume, selectedColumn }: Props) {
  return (
    <div className={styles.flexColumn}>
      <h2 className={styles.marginTop}>Sons:</h2>
      <div className={styles.volumeContainer}>
        {selectedColumn === 3 && <span className={styles.cursor}>▼</span>}

        <h2 className={styles.marginTop}>Efeitos Sonoros: {sfxVolume}</h2>

        <div className={styles.flexRow}>
          <Minus />
          <div className={styles.volumeBar}>
            <div
              className={styles.volumeFill}
              style={{ width: `${sfxVolume}%` }}
            />
          </div>
          <Plus />
        </div>
      </div>
      <div className={styles.volumeContainer}>
        {selectedColumn === 4 && <span className={styles.cursor}>▼</span>}

        <h2 className={styles.marginTop}>Música de Fundo: {bgmVolume}</h2>
        <div className={styles.flexRow}>
          <Minus />
          <div className={styles.volumeBar}>
            <div
              className={styles.volumeFill}
              style={{ width: `${bgmVolume}%` }}
            />
          </div>
          <Plus />
        </div>
      </div>
    </div>
  );
}
