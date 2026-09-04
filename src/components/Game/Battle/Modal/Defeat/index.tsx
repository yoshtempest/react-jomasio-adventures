import styles from "./styles.module.css";
import { useEffect, useRef, useCallback } from "react";
import { usePlayerActions } from "@/contexts/PlayerContext";
import { useSoundEffects } from "@/contexts/SoundEffectsContext";
import { useGameControls } from "@/contexts/GameControlsContext";
import { useLatestRef } from "@/hooks/useLatestRef";
import { formatDuration } from "@/utils/formatDuration";
import { playerPath } from "@/utils/paths";
import { ActivePotionDisplay } from "@/components/Game/Battle/ActivePotionDisplay";
import { FleeButton } from "@/components/Game/Battle/Buttons/Run";
import {
  useDefeatCharacterSelect,
  type DefeatMenuSelection,
} from "@/hooks/battle/defeat/useDefeatCharacterSelect";

type Props = {
  isOpen: boolean;
  title?: string;
  onContinue: () => void;
  onBack: () => void;
  progress: number;
  elapsed: number;
  bestTime: number;
  showRetry?: boolean;
};

export function DefeatModal({
  isOpen,
  title = "Derrota",
  onContinue,
  onBack,
  progress,
  elapsed,
  bestTime,
  showRetry = true,
}: Props) {
  const { setMode } = usePlayerActions();
  const { playSound } = useSoundEffects();
  const { pushControls } = useGameControls();
  const hasPlayedRef = useRef(false);

  const {
    unlockedCharacters,
    menuSelection,
    charIndex,
    view,
    openCharacterSelect,
    selectCharacter,
  } = useDefeatCharacterSelect(isOpen);

  const onContinueRef = useLatestRef(onContinue);
  const onBackRef = useLatestRef(onBack);
  const setModeRef = useLatestRef(setMode);
  const viewRef = useLatestRef(view);

  const executeSelected = useCallback(() => {
    if (menuSelection === "retry" && showRetry) {
      playSound("tryAgain");
      onContinueRef.current();
    } else if (menuSelection === "characterSelect") {
      openCharacterSelect();
    } else {
      playSound("run");
      onBackRef.current();
      setModeRef.current("explore");
    }
  }, [
    menuSelection,
    playSound,
    openCharacterSelect,
    showRetry,
    onBackRef,
    onContinueRef,
    setModeRef,
  ]);

  const executeSelectedRef = useLatestRef(executeSelected);

  useEffect(() => {
    if (isOpen && !hasPlayedRef.current) {
      hasPlayedRef.current = true;
      playSound("defeat");
    }

    if (!isOpen) {
      hasPlayedRef.current = false;
    }
  }, [isOpen, playSound]);

  useEffect(() => {
    if (!isOpen) return;

    const remove = pushControls({
      onConfirm: () => {
        if (viewRef.current !== "menu") return;
        executeSelectedRef.current();
        return true;
      },
      onCancel: () => {
        playSound("run");
        onBackRef.current();
        setModeRef.current("explore");
      },
    });

    return remove;
  }, [
    isOpen,
    pushControls,
    playSound,
    executeSelectedRef,
    onBackRef,
    setModeRef,
    viewRef,
  ]);

  if (!isOpen) return null;

  const menuBtnClass = (sel: DefeatMenuSelection) =>
    `${styles.button} ${menuSelection === sel ? styles.active : ""}`;

  return (
    <div className="overlay">
      <div className={`modal ${styles.modal}`}>
        <h1>{title}</h1>
        <div className={styles.progressSection}>
          <p className={styles.label}>Progresso na batalha</p>
          <div className={styles.bar}>
            <div
              className={styles.fill}
              style={{ width: `${progress * 100}%` }}
            />
          </div>
          <p className={styles.text}>{(progress * 100).toFixed(0)}%</p>
        </div>
        <div className={styles.timeSection}>
          <p className={styles.timeRow}>
            <span className={styles.timeLabel}>Tempo:</span>
            <span>{formatDuration(elapsed)}</span>
          </p>
          <p className={styles.timeRow}>
            <span className={styles.timeLabel}>Melhor tempo:</span>
            <span>{bestTime > 0 ? formatDuration(bestTime) : "0:00"}</span>
          </p>
        </div>
        <ActivePotionDisplay />
        <div className={styles.buttonContainer}>
          {showRetry && (
            <button className={menuBtnClass("retry")} onClick={executeSelected}>
              Tentar novamente
            </button>
          )}
          <button
            className={menuBtnClass("characterSelect")}
            onClick={openCharacterSelect}
          >
            Trocar personagem
          </button>
          <div>
            <FleeButton
              onClick={executeSelected}
              isSelected={menuSelection === "flee"}
            />
          </div>
        </div>
        {view === "characterSelect" && (
          <div className={styles.characterSelectContainer}>
            <p className={styles.characterSelectLabel}>
              Selecione um personagem
            </p>
            <div className={styles.characterGrid}>
              {unlockedCharacters.map((char, i) => (
                <button
                  key={char.image}
                  className={`${styles.characterCard} ${
                    i === charIndex ? styles.characterCardActive : ""
                  }`}
                  onClick={() => selectCharacter(i)}
                >
                  <img
                    src={playerPath(`/${char.image}/default.svg`)}
                    className={styles.characterImage}
                  />
                  <p className={styles.characterName}>{char.name}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
