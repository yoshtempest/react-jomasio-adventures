import styles from "./styles.module.css";
import { Lock, RefreshCw } from "lucide-react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useConfigMenu } from "@/hooks/menu/config/useConfig";
import { useAudio } from "@/contexts/AudioContext";
import { useSettings } from "@/contexts/SettingsContext";
import { DIALOGUE_SPEED_LIST, SPEED_LABEL } from "@/utils/settings";

import { useDialogue } from "@/hooks/interaction/useDialogue";
import { useEffect, useMemo, useRef } from "react";
import { configsDialogue } from "@/data/dialogues/configs";
import { DIFFICULTY_LABEL } from "@/data/npc/difficultyLabels";
import { VictorTutorial } from "@/components/Navbar/Config/VictorTutorial";
import InstallButton from "@/components/PWA";
import { useUpdate } from "@/contexts/UpdateContext";
import { CONFIG_TABS, CONFIG_TAB_LABELS } from "@/data/config/tabs";
import { useBattleInfo } from "@/contexts/BattleInfoContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useTitles } from "@/contexts/TitleContext";
import {
  getEquipmentStatsBonus,
  getTotalArmor,
  getTotalShield,
  getTotalVampirism,
  getTotalReflect,
} from "@/gameRules/battle/equipment";
import { getRankMultiplier } from "@/gameRules/rank";
import { getHungerMultiplier } from "@/contexts/CharacterProgressContext";
import { getNpcDisplayName } from "@/utils/types/npc/npcNames";
import { CLASS_DATA } from "@/data/npc/class";
import { npcPath } from "@/utils/paths";

export function Config() {
  const { difficulty } = usePlayer();
  const { sfxVolume, bgmVolume } = useAudio();
  const { dialogueSpeed } = useSettings();
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
    <div className="containerOfNavbar" ref={configRef}>
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
        <>
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
            <h2>Diálogo: {SPEED_LABEL[dialogueSpeed]}</h2>
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
        </>
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

function UpdateButton() {
  const { status, checkForUpdate } = useUpdate();

  const label = status === "checking"
    ? "Verificando..."
    : status === "error"
      ? "Erro ao verificar"
      : "Verificar atualização";

  return (
    <button
      type="button"
      className={styles.tutorialButton}
      onClick={checkForUpdate}
      disabled={status === "checking"}
    >
      <RefreshCw size={14} className={status === "checking" ? styles.spinning : undefined} />
      {label}
    </button>
  );
}

function BattleTab() {
  const battleInfoCtx = useBattleInfo();
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
  const { getBonus } = useTitles();

  const battleInfo = battleInfoCtx?.battleInfo;

  const playerStats = useMemo(() => {
    const baseChar = progress[player.character];
    if (!baseChar) return null;

    const equipmentBonus = getEquipmentStatsBonus(player.character);
    const titleBonus = getBonus();
    const rankMultiplier = getRankMultiplier(baseChar.level);
    const hungerMultiplier = getHungerMultiplier(baseChar.hunger);
    const allStatsPct = 1 + titleBonus.percentAllStats / 100;

    const hp = Math.round((baseChar.stats.hp + equipmentBonus.hp + titleBonus.hp) * allStatsPct * rankMultiplier * hungerMultiplier);
    const strength = Math.round((baseChar.stats.strength + equipmentBonus.strength + titleBonus.strength) * allStatsPct * rankMultiplier * hungerMultiplier);
    const intelligence = Math.round((baseChar.stats.intelligence + equipmentBonus.intelligence + titleBonus.intelligence) * allStatsPct * rankMultiplier * hungerMultiplier);
    const resistance = Math.round(baseChar.stats.resistance * allStatsPct * rankMultiplier * hungerMultiplier);
    const tenacity = baseChar.stats.tenacity + (equipmentBonus.tenacity ?? 0);
    const armor = getTotalArmor(player.character, baseChar.stats.resistance) + titleBonus.armor;
    const shield = getTotalShield(player.character) + titleBonus.shield;
    const vampirism = getTotalVampirism(player.character);
    const reflect = getTotalReflect(player.character);
    const maxHp = 90 + hp * 10;

    return { maxHp, strength, intelligence, resistance, tenacity, armor, shield, vampirism, reflect };
  }, [player.character, progress, getBonus]);

  const winProbability = useMemo(() => {
    if (!battleInfo || !playerStats) return null;
    const enemyTotal = battleInfo.npcHp + battleInfo.npcDamage + battleInfo.npcArmor;
    const playerTotal = playerStats.maxHp + playerStats.strength + playerStats.intelligence +
      playerStats.resistance + playerStats.tenacity + playerStats.armor +
      playerStats.shield + playerStats.vampirism + playerStats.reflect;
    if (playerTotal + enemyTotal === 0) return 50;
    return Math.round((playerTotal / (playerTotal + enemyTotal)) * 100);
  }, [battleInfo, playerStats]);

  if (!battleInfo || !playerStats) {
    return <p className={styles.empty}>Abra as configurações durante uma batalha para ver as informações.</p>;
  }

  const classData = CLASS_DATA[battleInfo.npcClass];
  const spriteSrc = `/${battleInfo.npcType}/right.svg`;

  return (
    <div className={styles.battleContainer}>
      <div className={styles.battleEntities}>
        <div className={styles.battleCard}>
          <div className={styles.battleCardHeader}>
            <img
              src={npcPath(spriteSrc)}
              alt={getNpcDisplayName(battleInfo.npcType)}
              className={styles.npcSprite}
            />
            <div>
              <h3>{getNpcDisplayName(battleInfo.npcType)}</h3>
              <span className={styles.npcClassLabel} style={{ color: classData.color }}>
                {classData.label}
              </span>
              <p className={styles.statLine}>Nível: {battleInfo.npcLevel}</p>
            </div>
          </div>
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>HP</span>
              <span className={styles.statValue}>{playerStats.maxHp}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Força</span>
              <span className={styles.statValue}>{playerStats.strength}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Inteligência</span>
              <span className={styles.statValue}>{playerStats.intelligence}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Resistência</span>
              <span className={styles.statValue}>{playerStats.resistance}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Tenacidade</span>
              <span className={styles.statValue}>{playerStats.tenacity}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Armadura</span>
              <span className={styles.statValue}>{playerStats.armor}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Escudo</span>
              <span className={styles.statValue}>{playerStats.shield}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Vampirismo</span>
              <span className={styles.statValue}>{playerStats.vampirism}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Reflexo</span>
              <span className={styles.statValue}>{playerStats.reflect}</span>
            </div>
          </div>
        </div>
        <h2>VS</h2>
        <div className={styles.battleCard}>
          <div className={styles.battleCardHeader}>
            <img
              src={npcPath(spriteSrc)}
              alt={getNpcDisplayName(battleInfo.npcType)}
              className={styles.npcSprite}
            />
            <div>
              <h3>{getNpcDisplayName(battleInfo.npcType)}</h3>
              <span className={styles.npcClassLabel}>
                Classe: <span style={{ color: classData.color }}>{classData.label}</span>
              </span>
              <p className={styles.statLine}>Nível: {battleInfo.npcLevel}</p>
            </div>
          </div>
          <div className={styles.statGrid}>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>HP</span>
              <span className={styles.statValue}>{Math.round(battleInfo.npcHp)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Dano</span>
              <span className={styles.statValue}>{Math.round(battleInfo.npcDamage)}</span>
            </div>
            <div className={styles.statItem}>
              <span className={styles.statLabel}>Armadura</span>
              <span className={styles.statValue}>{Math.round(battleInfo.npcArmor)}</span>
            </div>
          </div>
        </div>
      </div>

      <h2 className={styles.marginTop}>Chance de Vitória</h2>
      <div className={styles.probabilityBar}>
        <div
          className={styles.probabilityFill}
          style={{ width: `${winProbability ?? 0}%` }}
        />
        <span className={styles.probabilityText}>{winProbability ?? 0}%</span>
      </div>
    </div>
  );
}
