import styles from "./styles.module.css";
import type { ComboRank } from "@/hooks/battle/useComboSystem";

type Props = {
  count: number;
  rank: ComboRank;
  progress: number;
  nextRank: ComboRank | null;
};

const RANK_CLASS: Record<ComboRank, string> = {
  F: styles.rankF,
  E: styles.rankE,
  D: styles.rankD,
  C: styles.rankC,
  B: styles.rankB,
  A: styles.rankA,
  S: styles.rankS,
  "S+": styles.rankSplus,
  SS: styles.rankSS,
};

export function ComboDisplay({ count, rank, progress, nextRank }: Props) {
  if (count === 0 && rank === "F") return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={`${styles.rank} ${RANK_CLASS[rank]}`}>{rank}</div>
        <div className={styles.count}>{count}</div>
      </div>
      {nextRank && (
        <div className={styles.progressBar}>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <span className={styles.nextLabel}>{nextRank}</span>
        </div>
      )}
    </div>
  );
}
