import styles from "./styles.module.css";

type Props = {
  currentFrame: number;
  totalFrames: number;
  pct: number;
  onSeek: (frame: number) => void;
};

export function ReplayProgress({ currentFrame, totalFrames, pct, onSeek }: Props) {
  return (
    <div className={styles.progOuter}>
      <div className={styles.progFill} style={{ width: `${pct}%` }} />
      <input
        type="range"
        min={0}
        max={totalFrames - 1}
        value={currentFrame}
        onChange={(e) => onSeek(Number(e.target.value))}
        className={styles.slider}
      />
    </div>
  );
}
