import styles from "./styles.module.css";

const RANK_COLORS: Record<string, string> = {
  F: "#888",
  E: "#8b8b00",
  D: "#cd7f32",
  C: "#c0c0c0",
  B: "var(--gold)",
  A: "#ff6b35",
  S: "#ff0044",
  "S+": "#ff00ff",
  SS: "#00ffff",
};

type Props = {
  count: number;
  rank: string;
  progress: number;
  nextRank: string | null;
};

export function ComboDisplay({ count, rank, progress, nextRank }: Props) {
  if (count <= 0) return null;

  return (
    <div className={styles.comboBox}>
      <div className={styles.comboHeader}>
        <span
          className={styles.comboRank}
          style={{ color: RANK_COLORS[rank] ?? "#fff" }}
        >
          {rank}
        </span>
        <span className={styles.comboCount}>{count}</span>
      </div>
      {nextRank && (
        <div className={styles.comboProgOuter}>
          <div
            className={styles.comboProgFill}
            style={{ width: `${progress * 100}%` }}
          />
          <span className={styles.comboNextLabel}>{nextRank}</span>
        </div>
      )}
    </div>
  );
}
