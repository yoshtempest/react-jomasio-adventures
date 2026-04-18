import styles from "./styles.module.css";

type Props = {
  isOpen: boolean;
  title?: string;
  onContinue: () => void;
};

export function DefeatModal({
  isOpen,
  title = "Derrota",
  onContinue,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h1>{title}</h1>

        <button className={styles.button} onClick={onContinue}>
          Tentar novamente
        </button>
      </div>
    </div>
  );
}