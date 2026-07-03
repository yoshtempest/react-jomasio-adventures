import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { getRank, formatRank } from "@/gameRules/rank";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

type Props = {
  myLevel: number;
  xpReward: number;
  nextLevelXp: number;
  coinReward: number;
};

export function RewardCards({
  myLevel,
  xpReward,
  nextLevelXp,
  coinReward,
}: Props) {
  const [displayXp, setDisplayXp] = useState(1);
  const rank = getRank(myLevel);
  const { playSound } = useSoundEffects();

  useEffect(() => {
    if (xpReward <= 1) {
      playSound("gainXp");
      setDisplayXp(xpReward);
      return;
    }

    setDisplayXp(1);
    playSound("gainXp");

    const duration = 3000;
    let rafId: number;
    let startTime = 0;

    function animate(now: number) {
      if (!startTime) startTime = now;
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - progress) * (1 - progress);
      const current = Math.max(1, Math.round(eased * xpReward));

      setDisplayXp(Math.min(current, xpReward));

      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      }
    }

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [xpReward, playSound]);

  return (
    <div className={styles.rewardsGrid}>
      <div className={styles.rewardCard}>
        <span className={styles.rewardLabel}>Seu nível</span>
        <span className={styles.rewardValue}>{myLevel}</span>
      </div>
      <div className={styles.rewardCard}>
        <span className={styles.rewardLabel}>Ranque</span>
        <span className={styles.rankValue}>{formatRank(rank)}</span>
      </div>
      <div className={styles.rewardCard}>
        <span className={styles.rewardLabel}>XP ganho</span>
        <span className={styles.rewardValue}>+{displayXp}</span>
      </div>
      <div className={styles.rewardCard}>
        <span className={styles.rewardLabel}>Próx Nível - XP</span>
        <span className={styles.rewardValue}>{nextLevelXp}</span>
      </div>
      <div className={styles.rewardCard}>
        <span className={styles.rewardLabel}>Moedas</span>
        <span className={styles.rewardValue}>+{coinReward}</span>
      </div>
    </div>
  );
}
