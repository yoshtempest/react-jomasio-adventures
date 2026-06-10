import styles from "./styles.module.css";
import { useEffect, useRef, useState } from "react";
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
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;

  const hasPlayedRef = useRef(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setIsVisible(false);
      return;
    }

    const timeout = setTimeout(() => {
      setIsVisible(true);
    }, 3000);

    return () => clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (isVisible && !hasPlayedRef.current) {
      hasPlayedRef.current = true;

      playSoundRef.current("win");
    }

    if (!isOpen) {
      hasPlayedRef.current = false;
    }
  }, [isVisible, isOpen]);
  
  useEffect(() => {
    if (!isVisible) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter" || e.key.toLowerCase() === "l") {
        onContinue();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isVisible, onContinue]);

  if (!isVisible) return null;

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