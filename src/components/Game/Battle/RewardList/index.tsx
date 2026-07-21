import { useEffect, useState } from "react";
import styles from "./styles.module.css";
import { getRank, formatRank } from "@/gameRules/rank";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { getBattleRewards } from "@/data/player/stats";
import { RewardCard } from "./RewardCard";

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

  const rewardCard = getBattleRewards({
    myLevel: myLevel,
    rank: formatRank(rank),
    xpReward: displayXp,
    nextLevelXp: nextLevelXp,
    coinReward: coinReward,
  });

  return (
    <div className={styles.rewardsGrid}>
      {rewardCard.map((stat) => (
        <RewardCard key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
}
