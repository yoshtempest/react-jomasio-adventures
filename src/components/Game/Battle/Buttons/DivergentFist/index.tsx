import { HandFist } from "lucide-react";
import { DIVERGENT_FIST_COST } from "@/gameRules/battle/cursedEnergy";
import styles from "./styles.module.css";

type Props = {
  energy: number;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

export function DivergentFistButton({
  energy,
  active = false,
  disabled = false,
  onClick,
}: Props) {

  return (
    <button
      className={`${styles.button} ${active ? styles.active : ""} ${
        disabled ? styles.disabled : ""
      }`}
      onClick={onClick}
      disabled={disabled}
      title={`Punho Divergente: o próximo golpe é um soco com 100% de chance de causar 2 instâncias de dano (custa ${DIVERGENT_FIST_COST} de energia amaldiçoada)`}
    >
      <span className={styles.value}>{Math.round(energy)}</span>
      <span className={styles.label}>
        <HandFist size={14} />
        PUNHO
      </span>
      <span className={styles.cost}>-{DIVERGENT_FIST_COST}</span>
    </button>
  );
}