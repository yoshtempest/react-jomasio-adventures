import styles from "./styles.module.css";
import { useEffect, useRef } from "react";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";

type Props = {
  isOpen: boolean;
  enemyType: string;
  enemyLevel: number;
  myLevel: number;
  nextLevelXp: number;
  onContinue: () => void;
  xpReward: number;
};

export function VictoryModal({
  isOpen,
  enemyType,
  enemyLevel,
  myLevel,
  nextLevelXp,
  onContinue,
  xpReward,
}: Props) {
  const { playSound } = useSoundEffects();

  const hasPlayedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !hasPlayedRef.current) {
      hasPlayedRef.current = true;

      playSound("win");
    }

    if (!isOpen) {
      hasPlayedRef.current = false;
    }
  }, [isOpen]);
  
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
    <div className="overlay">
      <div className={`modal ${styles.modal}`}>
        <h1>Vitória!</h1>

        <p>
          Você derrotou um {enemyType} nv. {enemyLevel}
        </p>
        <p>Seu nível: {myLevel}</p>

        <p>Xp ganho: {xpReward}</p>

        <p>Xp para o próximo nível: {nextLevelXp}</p>

        <button className={styles.button} onClick={onContinue}>
          Continuar
        </button>
      </div>
    </div>
  );
}