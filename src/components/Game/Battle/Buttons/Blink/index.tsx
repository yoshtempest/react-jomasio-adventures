import { Zap } from "lucide-react";
import { BLINK_ENERGY_COST } from "@/gameRules/battle/cursedEnergy";
import styles from "./styles.module.css";

type Props = {
  energy: number;
  energyMax: number;
  disabled?: boolean;
  onClick: () => void;
};

export function BlinkButton({
  energy,
  energyMax,
  disabled = false,
  onClick,
}: Props) {
  const pct = energyMax > 0 ? Math.round((energy / energyMax) * 100) : 0;

  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ""}`}
      onClick={onClick}
      disabled={disabled}
      title={`Blink: teleporte curto à frente (custa ${BLINK_ENERGY_COST} de energia amaldiçoada)`}
    >
      <span className={styles.energyBar} style={{ width: `${pct}%` }} />
      <span className={styles.value}>{Math.round(energy)}</span>
      <span className={styles.label}>
        <Zap size={14} />
        BLINK
      </span>
      <span className={styles.cost}>-{BLINK_ENERGY_COST}</span>
    </button>
  );
}