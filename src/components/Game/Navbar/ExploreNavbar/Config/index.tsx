import styles from "./styles.module.css";
import { useLatestRef } from "@/hooks/useLatestRef";
import { useConfigSelection } from "@/hooks/menu/config/useConfigSelection";
import { useAudio } from "@/hooks/useAudio";
import { usePlayer } from "@/contexts/PlayerContext";
import { useSettings } from "@/hooks/useSetting";
import { useDialogue } from "@/hooks/interaction/useDialogue";
import { useEffect, useRef } from "react";
import { configsDialogue } from "@/data/dialogues/configs";
import { VictorTutorial } from "@/components/Game/Navbar/ExploreNavbar/Config/VictorTutorial";
import { CONFIG_TABS, CONFIG_TAB_LABELS } from "@/data/config/tabs";
import { BattleTab } from "./BattleTab";
import { DifficultySection } from "./Difficulty";
import { DialogueSpeedSection } from "./DialogueSpeed";
import { HelpSection } from "./Help";
import { VolumeSection } from "./Volume";

export function Config() {
  const { sfxVolume, bgmVolume, setSfxVolume, setBgmVolume } = useAudio();
  const { difficulty } = usePlayer();
  const { dialogueSpeed } = useSettings();
  const {
    difficulty: difficultyList,
    selectedIndex,
    selectedColumn,
    screen,
    showQuestIndicator,
    showComboAction,
    showHighlight,
    sharedXp,
    activeTab,
    isOnTab,
  } = useConfigSelection(true);
  const dialogueSystem = useDialogue(configsDialogue);
  const dialogueSystemRef = useLatestRef(dialogueSystem);
  const configRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (screen === "tutorial") {
      dialogueSystemRef.current.start();
    }
  }, [screen, dialogueSystemRef]);

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
      <div className="tabs">
        {CONFIG_TABS.map((tab) => (
          <button
            key={tab}
            className={`${"tab"} ${activeTab === tab ? "tabActive" : ""} ${isOnTab && activeTab === tab ? "tabSelected" : ""}`}
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
            activeDifficulty={difficulty}
          />

          <DialogueSpeedSection
            selectedIndex={selectedIndex}
            selectedColumn={selectedColumn}
            activeSpeed={dialogueSpeed}
          />

          <HelpSection
            selectedColumn={selectedColumn}
            selectedIndex={selectedIndex}
            showQuestIndicator={showQuestIndicator}
            sharedXp={sharedXp}
          />

          <VolumeSection
            sfxVolume={sfxVolume}
            bgmVolume={bgmVolume}
            selectedColumn={selectedColumn}
            onSfxDown={() => setSfxVolume(Math.max(sfxVolume - 10, 0))}
            onSfxUp={() => setSfxVolume(Math.min(sfxVolume + 10, 100))}
            onBgmDown={() => setBgmVolume(Math.max(bgmVolume - 10, 0))}
            onBgmUp={() => setBgmVolume(Math.min(bgmVolume + 10, 100))}
          />
        </div>
      )}

      {activeTab === "batalha" && (
        <BattleTab
          showComboAction={showComboAction}
          showHighlight={showHighlight}
          selectedIndex={selectedIndex}
        />
      )}

      {screen === "tutorial" && <VictorTutorial />}
    </div>
  );
}
