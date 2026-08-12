import { PET_ROLE_LABELS, type PetRole } from "@/data/characters/petSkills";
import styles from "./styles.module.css";

type Props = {
  petName: string;
  role: PetRole;
  skillName: string;
  ready: boolean;
  remaining: number;
  cooldownMs: number;
  disabled?: boolean;
  onClick: () => void;
};

export function PetSkillButton({
  petName,
  role,
  skillName,
  ready,
  remaining,
  cooldownMs,
  disabled = false,
  onClick,
}: Props) {
  const seconds = Math.ceil(cooldownMs / 1000);
  const locked = !ready || disabled;

  return (
    <button
      className={`${styles.button} ${ready ? styles.ready : ""} ${
        disabled ? styles.disabled : ""
      }`}
      onClick={onClick}
      disabled={locked}
    >
      <span className={styles.role}>{PET_ROLE_LABELS[role]}</span>
      <span className={styles.skillName}>{skillName}</span>
      <span className={styles.petName}>{petName}</span>
      <span className={styles.cooldown}>
        {ready
          ? "Pronta para usar"
          : remaining > 0
            ? `${remaining}s`
            : `${seconds}s`}
      </span>
    </button>
  );
}
