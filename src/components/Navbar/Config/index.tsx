import styles from "./styles.module.css";
import { Lock } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useConfigMenu } from "@/hooks/menu/config/useConfig";
import { useAudio } from "@/contexts/AudioContext";
import { useSettings } from "@/contexts/SettingsContext";
import { DIALOGUE_SPEED_LIST, SPEED_LABEL } from "@/utils/settings";

import { useDialogue } from "@/hooks/interaction/useDialogue";
import { useEffect, useRef } from "react";
import { configsDialogue } from "@/data/dialogues/configs";
import { DIFFICULTY_LABEL } from "@/data/npc/difficultyLabels";
import { VictorTutorial } from "@/components/Navbar/Config/VictorTutorial";
import InstallButton from "@/components/PWA";

export function Config() {
  const { difficulty } = usePlayer();
  const { sfxVolume, bgmVolume } = useAudio();
  const { dialogueSpeed } = useSettings();
  const { difficultyList, selectedIndex, selectedRow, screen, showQuestIndicator } =
    useConfigMenu(true);
  const dialogueSystem = useDialogue(configsDialogue);
  const dialogueSystemRef = useRef(dialogueSystem);
  dialogueSystemRef.current = dialogueSystem;
  const configRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (screen === "tutorial") {
      dialogueSystemRef.current.start();
    }
  }, [screen]);

  useEffect(() => {
    if (!configRef.current) return;
    const selectedEl = configRef.current.children[selectedRow] as HTMLElement | undefined;
    if (!selectedEl) return;
    configRef.current.scrollTo({
      top: selectedEl.offsetTop - configRef.current.offsetTop,
      behavior: "smooth",
    });
  }, [selectedRow]);

  return (
    <div className={styles.config} ref={configRef}>
      <h2 className={styles.marginTop}>Dificuldade: {DIFFICULTY_LABEL[difficulty]}</h2>
      <div className={styles.difficultyContainer}>
        {difficultyList.map((diff, index) => {
          const isSelected = selectedRow === 0 && index === selectedIndex;
          return (
            <div
              key={diff}
              className={`${styles.difficultyItem} ${
                isSelected ? styles.selected : ""
              }`}
            >
              {isSelected && <span className={styles.cursor}>▼</span>}

              <h2>{DIFFICULTY_LABEL[diff].toUpperCase()}</h2>
            </div>
          );
        })}

        <div className={`${styles.difficultyItem} ${styles.locked}`}>
          <div className={styles.chainLeft} />
          <Lock size={16} />
          <h2>INSANO</h2>
          <div className={styles.chainRight} />
        </div>
      </div>
      <div className={styles.speedContainer}>
        <h2>Velocidade do Diálogo: {SPEED_LABEL[dialogueSpeed]}</h2>
        <div className={styles.speedOptions}>
          {selectedRow === 1 && <span className={styles.cursor}>▼</span>}
          {DIALOGUE_SPEED_LIST.map((speed, index) => {
            const isSelected = selectedRow === 1 && index === selectedIndex;
            return (
              <div
                key={speed}
                className={`${styles.speedItem} ${
                  isSelected ? styles.selected : ""
                }`}
              >
                <h2>{SPEED_LABEL[speed].toUpperCase()}</h2>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.flexRow}>
        <div className={styles.volumeContainer}>
          {selectedRow === 2 && <span className={styles.cursor}>▼</span>}

          <h2>Efeitos Sonoros: {sfxVolume}</h2>

          <div className={styles.volumeBar}>
            <div className={styles.volumeFill} style={{ width: `${sfxVolume}%` }} />
          </div>
        </div>
        <div className={styles.volumeContainer}>
          {selectedRow === 3 && <span className={styles.cursor}>▼</span>}

          <h2>Música de Fundo: {bgmVolume}</h2>

          <div className={styles.volumeBar}>
            <div className={styles.volumeFill} style={{ width: `${bgmVolume}%` }} />
          </div>
        </div>
      </div>
      <div className={styles.flexRow}>
        <div
          className={`${styles.indicatorButton} ${
            selectedRow === 4 ? styles.selected : ""
          }`}
        >
          {selectedRow === 4 && <span className={styles.cursor}>▼</span>}

          <h2 className={styles.indicatorText}>Indicador de Missões: {showQuestIndicator ? "ON" : "OFF"}</h2>
        </div>
        <div
          className={`${styles.tutorialButton} ${
            selectedRow === 5 ? styles.selected : ""
          }`}
        >
          {selectedRow === 5 && <span className={styles.cursor}>▼</span>}

          <h2>Ver Tutorial</h2>
        </div>
        <InstallButton />
      </div>

      {screen === "tutorial" && (
        <VictorTutorial />
      )}
    </div>
  );
}
