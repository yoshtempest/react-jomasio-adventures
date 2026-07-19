import { useRef, useEffect } from "react";
import styles from "../styles.module.css";
import { CHARACTERS } from "@/utils/types/player/player";
import { CHARACTERS as CHARACTER_OPTIONS } from "@/data/options/characters";

type PlayerRewardsProps = {
  rewards: RewardProgress[];
  selectedRewardIndex: number;
  onClaim: (rewardId: string) => void;
};

function charLabel(char: string): string {
  const opt = CHARACTER_OPTIONS.find((c) => c.image === char);
  return opt?.name ?? char;
}

export function PlayerRewards({
  rewards,
  selectedRewardIndex,
  onClaim,
}: PlayerRewardsProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    selectedRef.current?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [selectedRewardIndex]);

  const globalRewards = rewards.filter((r) => !r.charId);
  const totalRewards = globalRewards.length;

  return (
    <div ref={scrollRef} className={styles.container}>
      <div className={styles.section}>
        <div className={styles.sectionTitle}>Recompensas</div>
        {globalRewards.length === 0 && (
          <div className={styles.statRow}>
            <span className={styles.statLabel}>
              Nenhuma recompensa disponível
            </span>
          </div>
        )}
        {globalRewards.map((r, idx) => (
          <div
            key={r.id}
            ref={idx === selectedRewardIndex ? selectedRef : undefined}
            className={`${styles.rewardRow} ${
              idx === selectedRewardIndex ? styles.rewardRowSelected : ""
            }`}
          >
            <div className={styles.rewardInfo}>
              <span className={styles.rewardLabel}>{r.label}</span>
              <span className={styles.rewardProgress}>
                {r.current}/{r.requirement}
              </span>
            </div>
            <div className={styles.rewardAction}>
              <span className={styles.rewardValue}>+{r.reward} HyperCoins</span>
              <button
                className={r.canClaim ? styles.claimBtn : styles.claimBtnDone}
                disabled={!r.canClaim}
                onClick={() => onClaim(r.id)}
              >
                {r.canClaim ? "Receber" : "OK"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {CHARACTERS.map((char) => {
        const charRewards = rewards.filter((r) => r.charId === char);
        if (charRewards.length === 0) return null;

        const startIdx =
          totalRewards +
          rewards.filter(
            (r) =>
              r.charId &&
              CHARACTERS.indexOf(r.charId as (typeof CHARACTERS)[number]) <
                CHARACTERS.indexOf(char),
          ).length;

        return (
          <div key={char} className={styles.charRewardSection}>
            <div className={styles.charRewardHeader}>{charLabel(char)}</div>
            {charRewards.map((r, i) => {
              const globalIdx = startIdx + i;
              return (
                <div
                  key={r.id}
                  ref={
                    globalIdx === selectedRewardIndex ? selectedRef : undefined
                  }
                  className={`${styles.rewardRow} ${
                    globalIdx === selectedRewardIndex
                      ? styles.rewardRowSelected
                      : ""
                  }`}
                >
                  <div className={styles.rewardInfo}>
                    <span className={styles.rewardLabel}>{r.label}</span>
                    <span className={styles.rewardProgress}>
                      {r.current}/{r.requirement}
                    </span>
                  </div>
                  <div className={styles.rewardAction}>
                    <span className={styles.rewardValue}>
                      +{r.reward} HyperCoins
                    </span>
                    <button
                      className={
                        r.canClaim ? styles.claimBtn : styles.claimBtnDone
                      }
                      disabled={!r.canClaim}
                      onClick={() => onClaim(r.id)}
                    >
                      {r.canClaim ? "Receber" : "OK"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}
