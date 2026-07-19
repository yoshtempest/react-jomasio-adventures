import { ProgressBar } from "@/components/ProgressBar";
import styles from "../styles.module.css";

type Mission = {
  id: string;
  label: string;
  progress: number;
  requirement: number;
  reward: number;
  completed: boolean;
  canClaim: boolean;
  claimed: boolean;
};

type Props = {
  currentMonth: string;
  completedCount: number;
  passTotal: number;
  passPct: number;
  missions: Mission[];
  onClaimMission: (id: string) => void;
};

export function MonthlyPassSection({
  currentMonth,
  completedCount,
  passTotal,
  passPct,
  missions,
  onClaimMission,
}: Props) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionTitle}>Passe Mensal — {formatMonth(currentMonth)}</div>
      <div className={styles.statRow}>
        <span className={styles.statLabel}>Progresso</span>
        <span className={styles.statValue}>{completedCount}/{passTotal} ({passPct}%)</span>
      </div>
      <ProgressBar
        value={passPct}
        max={100}
        className={styles.barOuter}
        color="var(--accent-color)"
      />
      {missions.map((m) => (
        <div key={m.id} className={styles.missionRow}>
          <div className={styles.missionInfo}>
            <span className={styles.missionLabel}>{m.label}</span>
            <span className={styles.missionProgress}>
              {m.completed ? "Completa" : `${m.progress}/${m.requirement}`}
            </span>
          </div>
          <div className={styles.missionAction}>
            <span className={styles.missionReward}>+{m.reward}</span>
            <button
              className={m.canClaim ? styles.claimBtn : styles.claimBtnDone}
              disabled={!m.canClaim}
              onClick={() => onClaimMission(m.id)}
            >
              {m.claimed ? "OK" : m.completed ? "Receber" : "—"}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function formatMonth(ym: string): string {
  const [y, m] = ym.split("-").map(Number);
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];
  return `${months[m - 1]} ${y}`;
}
