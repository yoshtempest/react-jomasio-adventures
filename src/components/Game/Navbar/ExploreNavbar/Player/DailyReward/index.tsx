import styles from "../styles.module.css";

type Props = {
  canClaim: boolean;
  timer: string;
  hyperCoins: number;
  coinsMin: number;
  coinsMax: number;
  onClaim: () => void;
};

export function DailyRewardSection({
  canClaim,
  timer,
  hyperCoins,
  coinsMin,
  coinsMax,
  onClaim,
}: Props) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>Recompensa Diária</div>
      <div className={styles.dailyCard}>
        <div className={styles.dailyInfo}>
          <span className={styles.dailyLabel}>
            {canClaim ? "Disponível!" : "Já recebida hoje"}
          </span>
          <span className={styles.dailyRewards}>
            +{hyperCoins} HyperCoins · {coinsMin}–{coinsMax} Kwanzas
          </span>
          {!canClaim && <span className={styles.dailyTimer}>{timer}</span>}
        </div>
        <button
          className={canClaim ? styles.claimBtn : styles.claimBtnDone}
          disabled={!canClaim}
          onClick={onClaim}
        >
          {canClaim ? "Receber" : "Amanhã"}
        </button>
      </div>
    </div>
  );
}
