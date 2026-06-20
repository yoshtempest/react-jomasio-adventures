import styles from "./styles.module.css";
import { useEffect, useRef, useState, useCallback } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useGameControls } from "@/contexts/GameControlsContext";

type Option = "retry" | "flee";

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
  const [selected, setSelected] = useState<Option>("retry");
  const { setMode } = usePlayer();
  const { playSound } = useSoundEffects();
  const { pushControls, popControls } = useGameControls();
  const playSoundRef = useRef(playSound);
  playSoundRef.current = playSound;
  const hasPlayedRef = useRef(false);

  const onContinueRef = useRef(onContinue);
  onContinueRef.current = onContinue;
  const onBackRef = useRef(onBack);
  onBackRef.current = onBack;
  const setModeRef = useRef(setMode);
  setModeRef.current = setMode;

  const executeSelected = useCallback(() => {
    if (selected === "retry") {
      playSoundRef.current("tryAgain");
      onContinueRef.current();
    } else {
      playSoundRef.current("run");
      onBackRef.current();
      setModeRef.current("explore");
    }
  }, [selected]);

  const selectNext = useCallback(() => {
    setSelected((prev) => (prev === "retry" ? "flee" : "retry"));
  }, []);

  const selectPrev = useCallback(() => {
    setSelected((prev) => (prev === "flee" ? "retry" : "flee"));
  }, []);

  useEffect(() => {
    if (isOpen && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      playSoundRef.current("defeat");
    }

    if (!isOpen) {
      hasPlayedRef.current = false;
      setSelected("retry");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    pushControls({
      onLeft: selectPrev,
      onRight: selectNext,
      onConfirm: executeSelected,
      onCancel: () => {
        playSoundRef.current("run");
        onBackRef.current();
        setModeRef.current("explore");
      },
    });

    return () => popControls();
  }, [isOpen, executeSelected, selectPrev, selectNext, pushControls, popControls]);

  if (!isOpen) return null;

  return (
    <div className="overlay">
      <div className={`modal ${styles.modal}`}>
        <h1>{title}</h1>
        <div className={styles.buttonContainer}>
          <button
            className={`${styles.button} ${selected === "retry" ? styles.active : ""}`}
            onClick={executeSelected}
          >
            Tentar novamente
          </button>
          <button
            className={`${styles.button} ${selected === "flee" ? styles.active : ""}`}
            onClick={executeSelected}
          >
            Fugir
          </button>
        </div>
      </div>
    </div>
  );
}
