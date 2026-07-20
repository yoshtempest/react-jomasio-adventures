import styles from "./styles.module.css";

const SPEEDS = [0.5, 1, 2, 4] as const;

type Props = {
  isPlaying: boolean;
  speed: number;
  onRestart: () => void;
  onStepBack: () => void;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onClose: () => void;
  onSpeedChange: (s: number) => void;
};

export function ReplayControls({
  isPlaying,
  speed,
  onRestart,
  onStepBack,
  onTogglePlay,
  onStepForward,
  onClose,
  onSpeedChange,
}: Props) {
  return (
    <div className={styles.controls}>
      <button className={styles.ctrlBtn} onClick={onRestart}>⟳</button>
      <button className={styles.ctrlBtn} onClick={onStepBack}>◀◀</button>
      <button className={styles.ctrlBtn} onClick={onTogglePlay}>
        {isPlaying ? "⏸" : "▶"}
      </button>
      <button className={styles.ctrlBtn} onClick={onStepForward}>▶▶</button>
      <div className={styles.speedGroup}>
        {SPEEDS.map((s) => (
          <button
            key={s}
            className={`${styles.speedBtn} ${speed === s ? styles.speedActive : ""}`}
            onClick={() => onSpeedChange(s)}
          >
            {s}x
          </button>
        ))}
      </div>
      <button className={styles.ctrlBtn} onClick={onClose}>✕</button>
    </div>
  );
}
