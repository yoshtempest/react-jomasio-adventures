import styles from "./styles.module.css";
import { useEffect } from "react";

type Props = {
  isOpen: boolean;
  enemyType: string;
  enemyLevel: number;
  myLevel: number;
  nextLevelXp: number;
  onContinue: () => void;
};

export function VictoryModal({
  isOpen,
  enemyType,
  enemyLevel,
  myLevel,
  nextLevelXp,
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
        <h1>Vitória!</h1>

        <p>
          Você derrotou um {enemyType} nv. {enemyLevel}
        </p>

        <p>Seu nível: {myLevel}</p>

        <p>Xp para o próximo nível: {nextLevelXp}</p>

        <button className={styles.button} onClick={onContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}