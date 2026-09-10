import { cursedEnergyHealAmount } from "@/gameRules/battle/cursedEnergy";
import styles from "./styles.module.css";

type Props = {
  energy: number;
  energyMax: number;
  disabled?: boolean;
  onClick: () => void;
};

export function CursedEnergyButton({
  energy,
  energyMax,
  disabled = false,
  onClick,
}: Props) {
  const heal = cursedEnergyHealAmount(energy);
  const pct = energyMax > 0 ? Math.round((energy / energyMax) * 100) : 0;

  return (
    <button
      className={`${styles.button} ${disabled ? styles.disabled : ""}`}
      onClick={onClick}
      disabled={disabled}
      title="Converte energia amaldiçoada em vida (5 energia = 1 HP)"
    >
      <span className={styles.energyBar} style={{ width: `${pct}%` }} />
      <span className={styles.value}>{Math.round(energy)}</span>
      {heal > 0 && <span className={styles.heal}>+{heal} HP</span>}
    </button>
  );
}