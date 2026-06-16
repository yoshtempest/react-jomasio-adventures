import styles from "./styles.module.css";

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
  return (
    <div className={styles.rewardsGrid}>
      <div className={styles.rewardCard}>
        <span className={styles.rewardLabel}>Seu nível</span>
        <span className={styles.rewardValue}>{myLevel}</span>
      </div>
      <div className={styles.rewardCard}>
        <span className={styles.rewardLabel}>XP ganho</span>
        <span className={styles.rewardValue}>+{xpReward}</span>
      </div>
      <div className={styles.rewardCard}>
        <span className={styles.rewardLabel}>XP até nível</span>
        <span className={styles.rewardValue}>{nextLevelXp}</span>
      </div>
      <div className={styles.rewardCard}>
        <span className={styles.rewardLabel}>Moedas</span>
        <span className={styles.rewardValue}>+{coinReward}</span>
      </div>
    </div>
  );
}
