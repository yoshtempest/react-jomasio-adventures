import styles from "./styles.module.css";

type Props = {
  onClick: () => void;
  isSelected?: boolean;
};

export function FleeButton({ onClick, isSelected }: Props) {
  return (
    <button
      className={`${styles.button} ${isSelected ? styles.active : ""}`}
      onClick={onClick}
    >
      Fugir
    </button>
  );
}
