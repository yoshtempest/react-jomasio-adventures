import styles from "./styles.module.css";
import { useConfigMenu } from "@/hooks/menu/config/useConfig";
import { useAudio } from "@/contexts/AudioContext";
import { useDialogue } from "@/hooks/interaction/useDialogue";
import { useEffect, useRef } from "react";
import { configsDialogue } from "@/data/dialogues/configs";
import { VictorTutorial } from "@/components/Navbar/Config/VictorTutorial";
import { CONFIG_TABS, CONFIG_TAB_LABELS } from "@/data/config/tabs";
import { BattleTab } from "./BattleTab";
import { DifficultySection } from "./Difficulty";
import { DialogueSpeedSection } from "./DialogueSpeed";
import { HelpSection } from "./Help";
import { VolumeSection } from "./Volume";

export function Config() {
  const { sfxVolume, bgmVolume } = useAudio();
  const {
    difficultyList,
    selectedIndex,
    selectedColumn,
    screen,
    showQuestIndicator,
    showComboAction,
    activeTab,
    isOnTab,
  } = useConfigMenu(true);
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
    const selectedEl = configRef.current.children[selectedColumn] as
      HTMLElement | undefined;
    if (!selectedEl) return;
    configRef.current.scrollTo({
      top: selectedEl.offsetTop - configRef.current.offsetTop,
      behavior: "smooth",
    });
  }, [selectedColumn]);

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
          <DifficultySection
            difficultyList={difficultyList}
            selectedIndex={selectedIndex}
            selectedColumn={selectedColumn}
          />

          <DialogueSpeedSection
            selectedIndex={selectedIndex}
            selectedColumn={selectedColumn}
          />

          <HelpSection
            selectedColumn={selectedColumn}
            selectedIndex={selectedIndex}
            showQuestIndicator={showQuestIndicator}
          />

          <VolumeSection
            sfxVolume={sfxVolume}
            bgmVolume={bgmVolume}
            selectedColumn={selectedColumn}
          />
        </div>
      )}

      {activeTab === "batalha" && (
        <BattleTab
          showComboAction={showComboAction}
          isSelected={selectedColumn === 0 && selectedIndex === 0}
        />
      )}

      {screen === "tutorial" && <VictorTutorial />}
    </div>
  );
}
