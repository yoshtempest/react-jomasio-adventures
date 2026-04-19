import styles from "./styles.module.css";
import { useEffect } from "react";

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
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key.toLowerCase() === "l") {
        onContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onContinue]);

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