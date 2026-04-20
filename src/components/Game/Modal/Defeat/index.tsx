import styles from "./styles.module.css";
import { useEffect } from "react";
import { usePlayer } from "@/contexts/PlayerContext";

type Props = {
  isOpen: boolean;
  title?: string;
  onContinue: () => void;
  onBack: () => void;
};

export function DefeatModal({
  isOpen,
  title = "Derrota",
  onContinue,
  onBack,
}: Props) {
  const { setMode } = usePlayer();
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key.toLowerCase() === "l") {
        onContinue();
      }
      if (e.key === "x" || e.key === "Esc") {
        onBack();
        setMode("explore");
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
        <div className={styles.buttonContainer}>
          <button className={styles.button} onClick={onContinue}>
            Tentar novamente
          </button>
          <button className={styles.button} onClick={onBack}>
            Fugir
          </button>
        </div>

      </div>
    </div>
  );
}