import styles from "./styles.module.css";

type Props = {
  isOpen: boolean;
  title?: string;
  description?: string;
  rewards?: string[];
  onContinue: () => void;
};

export function VictoryModal({
  isOpen,
  title = "Vitória!",
  description,
  rewards = [],
  onContinue,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1>{title}</h1>

        {description && <p>{description}</p>}

        {rewards.map((reward, index) => (
          <p key={index}>{reward}</p>
        ))}

        <button className={styles.button} onClick={onContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}