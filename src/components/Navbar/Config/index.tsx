import styles from "./styles.module.css";
import { Lock, Minus, Plus } from "lucide-react";
import { useConfigMenu } from "@/hooks/menu/config/useConfig";
import { useAudio } from "@/contexts/AudioContext";
import { DIALOGUE_SPEED_LIST, SPEED_LABEL } from "@/utils/settings";
import { useDialogue } from "@/hooks/interaction/useDialogue";
import { useEffect, useRef } from "react";
import { configsDialogue } from "@/data/dialogues/configs";
import { DIFFICULTY_LABEL } from "@/data/npc/difficultyLabels";
import { VictorTutorial } from "@/components/Navbar/Config/VictorTutorial";
import InstallButton from "@/components/PWA";
import { CONFIG_TABS, CONFIG_TAB_LABELS } from "@/data/config/tabs";
import { BattleTab } from "./BattleTab";
import { UpdateButton } from "./UpdateButton";

export function Config() {
  const { sfxVolume, bgmVolume } = useAudio();
  const { difficultyList, selectedIndex, selectedRow, bottomIndex, screen, showQuestIndicator, activeTab, isOnTab } =
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
    <div className={`containerOfNavbar ${styles.center}`} ref={configRef}>
      <div className={styles.tabs}>
        {CONFIG_TABS.map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ""} ${isOnTab && activeTab === tab ? styles.tabSelected : ""}`}
          >
            {CONFIG_TAB_LABELS[tab]}
          </button>
        ))}
      </div>
      
      {activeTab === "geral" && (
        <div className={styles.container}>
          <div className={styles.difficultyContainer}>
            <h2 className={styles.marginTop}>Dificuldade:</h2>
            {difficultyList.map((diff, index) => {
              const isSelected = selectedRow === 0 && index === selectedIndex;
              return (
                <div
                  key={diff}
                  className={`${styles.item} ${
                    isSelected ? styles.selected : ""
                  }`}
                >
                  {isSelected && <span className={styles.cursor}>▼</span>}

                  <h2>{DIFFICULTY_LABEL[diff].toUpperCase()}</h2>
                </div>
              );
            })}

            <div className={`${styles.item} ${styles.locked}`}>
              <div className={styles.chainLeft} />
              <Lock size={16} />
              <h2>INSANO</h2>
              <div className={styles.chainRight} />
            </div>
          </div>
          <div className={styles.speedContainer}>
            <h2 className={styles.marginTop}>Diálogo:</h2>
            <div className={styles.speedOptions}>
              {DIALOGUE_SPEED_LIST.map((speed, index) => {
                const isSelected = selectedRow === 1 && index === selectedIndex;
                return (
                  <div
                    key={speed}
                    className={`${styles.item} ${
                      isSelected ? styles.selected : ""
                    }`}
                  >
                    {isSelected && <span className={styles.cursor}>▼</span>}
                    <h2>{SPEED_LABEL[speed].toUpperCase()}</h2>
                  </div>
                );
              })}
            </div>
          </div>
          
          <div className={styles.flexColumn}>
            <h2 className={styles.marginTop}>Ajuda:</h2>
            <div
              className={`${styles.tutorialButton} ${
                selectedRow === 4 && bottomIndex === 0 ? styles.selected : ""
              }`}
            >
              {selectedRow === 4 && bottomIndex === 0 && <span className={styles.cursor}>▼</span>}

              <h2>Indicador de Missões: {showQuestIndicator ? "ON" : "OFF"}</h2>
            </div>
            <div
              className={`${styles.tutorialButton} ${
                selectedRow === 4 && bottomIndex === 1 ? styles.selected : ""
              }`}
            >
              {selectedRow === 4 && bottomIndex === 1 && <span className={styles.cursor}>▼</span>}

              <h2>Ver Tutorial</h2>
            </div>
            <div
              className={`${styles.tutorialButton} ${
                selectedRow === 4 && bottomIndex === 2 ? styles.selected : ""
              }`}
            >
              {selectedRow === 4 && bottomIndex === 2 && <span className={styles.cursor}>▼</span>}

              <UpdateButton />
            </div>
            <div
              className={`${styles.tutorialButton} ${
                selectedRow === 4 && bottomIndex === 3 ? styles.selected : ""
              }`}
            >
              {selectedRow === 4 && bottomIndex === 3 && <span className={styles.cursor}>▼</span>}

              <InstallButton />
            </div>
          </div>
          <div className={styles.flexColumn}>
            <h2 className={styles.marginTop}>Sons:</h2>
            <div className={styles.volumeContainer}>
              {selectedRow === 2 && <span className={styles.cursor}>▼</span>}

              <h2 className={styles.marginTop}>Efeitos Sonoros: {sfxVolume}</h2>

              <div className={styles.flexRow}>
                <Minus />
                <div className={styles.volumeBar}>
                  <div className={styles.volumeFill} style={{ width: `${sfxVolume}%` }} />
                </div>
                <Plus />
              </div>
            </div>
            <div className={styles.volumeContainer}>
              {selectedRow === 3 && <span className={styles.cursor}>▼</span>}

              <h2 className={styles.marginTop}>Música de Fundo: {bgmVolume}</h2>
              <div className={styles.flexRow}>
                <Minus />
                <div className={styles.volumeBar}>
                  <div className={styles.volumeFill} style={{ width: `${bgmVolume}%` }} />
                </div>
                <Plus />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "batalha" && (
        <BattleTab />
      )}

      {screen === "tutorial" && (
        <VictorTutorial />
      )}
    </div>
  );
}