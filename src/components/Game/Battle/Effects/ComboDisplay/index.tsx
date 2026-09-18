import { useEffect, useRef, useState } from "react";
import styles from "./styles.module.css";
import type { ComboRank } from "@/utils/types/battle/combo";
import { ONE_THOUSAND_MS } from "@/data/ms";

type Props = {
  count: number;
  rank: ComboRank;
  progress: number;
  nextRank: ComboRank | null;
};

const RANK_CLASS: Record<ComboRank, string> = {
  F: styles.rankF!,
  E: styles.rankE!,
  D: styles.rankD!,
  C: styles.rankC!,
  B: styles.rankB!,
  A: styles.rankA!,
  S: styles.rankS!,
  "S+": styles.rankSplus!,
  SS: styles.rankSS!,
};

type Phase = "visible" | "exiting" | "hidden";

export function ComboDisplay({ count, rank, progress, nextRank }: Props) {
  const [phase, setPhase] = useState<Phase>(() =>
    count > 0 ? "visible" : "hidden",
  );
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (timerRef.current !== null) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (count <= 0) {
      setPhase("hidden");
      return;
    }

    setPhase((prev) =>
      prev === "hidden" || prev === "exiting" ? "visible" : prev,
    );

    timerRef.current = setTimeout(() => {
      setPhase("exiting");
    }, ONE_THOUSAND_MS);
  }, [count]);

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) clearTimeout(timerRef.current);
    };
  }, []);

  if (phase === "hidden") return null;

  const exiting = phase === "exiting";

  function handleAnimationEnd() {
    if (exiting) {
      setPhase((prev) => (prev === "exiting" ? "hidden" : prev));
    }
  }

  return (
    <div className="navbarClip">
      <div
        className={`${styles.container} ${exiting ? styles.exiting : ""}`}
        onAnimationEnd={handleAnimationEnd}
      >
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
    </div>
  );
}
