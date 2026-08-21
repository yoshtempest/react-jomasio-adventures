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

      <span className={styles.skillName}>
        {ready
          ? skillName
          : remaining > 0
            ? ""
            : ""}
      </span>
      <span className={styles.cooldown}>
        {ready
          ? ""
          : remaining > 0
            ? `${remaining.toFixed(1)}s`
            : `${seconds}s`}
      </span>
    </button>
  );
}
