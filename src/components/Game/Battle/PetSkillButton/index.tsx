import styles from "./styles.module.css";

type Props = {
  skillName: string;
  ready: boolean;
  remaining: number;
  cooldownMs: number;
  imageUrl?: string;
  disabled?: boolean;
  onClick: () => void;
};

export function PetSkillButton({
  skillName,
  ready,
  remaining,
  cooldownMs,
  imageUrl,
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
      style={{
        backgroundImage: imageUrl ? `url("${imageUrl}")` : undefined,
        backgroundSize: imageUrl ? "cover" : undefined,
        backgroundPosition: imageUrl ? "center" : undefined,
      }}
      onClick={onClick}
      disabled={locked}
    >
      <span className={styles.skillName}>{skillName}</span>
      <span className={styles.cooldown}>
        {ready
          ? ""
          : remaining > 0
            ? `${remaining}s`
            : `${seconds}s`}
      </span>
    </button>
  );
}
