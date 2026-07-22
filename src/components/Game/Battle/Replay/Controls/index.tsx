import styles from "./styles.module.css";

const SPEEDS = [0.5, 1, 2, 4] as const;

type Props = {
  isPlaying: boolean;
  speed: number;
  selectedIndex: number;
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
  selectedIndex,
  onRestart,
  onStepBack,
  onTogglePlay,
  onStepForward,
  onClose,
  onSpeedChange,
}: Props) {
  const ctrlBtnCls = (i: number) =>
    `${styles.ctrlBtn} ${selectedIndex === i ? styles.ctrlBtnSelected : ""}`;

  return (
    <div className={styles.controls}>
      <button className={ctrlBtnCls(0)} onClick={onRestart}>
        ⟳
      </button>
      <button className={ctrlBtnCls(1)} onClick={onStepBack}>
        ◀◀
      </button>
      <button className={ctrlBtnCls(2)} onClick={onTogglePlay}>
        {isPlaying ? "⏸" : "▶"}
      </button>
      <button className={ctrlBtnCls(3)} onClick={onStepForward}>
        ▶▶
      </button>
      <div className={styles.speedGroup}>
        {SPEEDS.map((s, i) => (
          <button
            key={s}
            className={`${styles.speedBtn} ${speed === s ? styles.speedActive : ""} ${selectedIndex === 4 + i ? styles.speedBtnSelected : ""}`}
            onClick={() => onSpeedChange(s)}
          >
            {s}x
          </button>
        ))}
      </div>
      <button className={ctrlBtnCls(8)} onClick={onClose}>
        ✕
      </button>
    </div>
  );
}
