import { useCallback, useEffect, useState } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import {
  useCharacterProgress,
  getHungerMultiplier,
  MAX_HUNGER,
  MAX_SLEEP,
} from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useTitles } from "@/contexts/TitleContext";
import { CHARACTERS } from "@/data/options/characters";
import { npcPath, playerPath } from "@/utils/paths";
import { getRank, formatRank, getRankMultiplier } from "@/gameRules/rank";
import { getEquipmentStatsBonus } from "@/gameRules/battle/equipment";
import { ProgressBar } from "@/components/Game/ProgressBar";
import styles from "./styles.module.css";
import { Drumstick, Heart, Moon } from "lucide-react";

const HUNGRY_THRESHOLD = 20;

export function CharacterInfo() {
  const { player, playerClass } = usePlayer();
  const character = player.character;
  const { progress, getXPToNextLevel } = useCharacterProgress();
  const { getEquippedItem } = useEquipment();
  const { getBonus } = useTitles();

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const characterData = CHARACTERS.find((c) => c.image === player.character);

  const isHungry = charProgress.hunger <= HUNGRY_THRESHOLD;
  const [showImage, setShowImage] = useState(true);

  useEffect(() => {
    setShowImage(true);
  }, [isHungry]);

  const handleImageError = useCallback(() => {
    if (isHungry) {
      setShowImage(false);
    }
  }, [isHungry]);

  const petItem = getEquippedItem(character, "pet");
  const petNpcType = petItem?.id.replace("pet_", "");

  const equipmentBonus = getEquipmentStatsBonus(character);
  const titleBonus = getBonus();
  const rankMultiplier = getRankMultiplier(charProgress.level);
  const hungerMultiplier = getHungerMultiplier(charProgress.hunger);
  const allStatsPct = 1 + titleBonus.percentAllStats / 100;
  const effectiveHp =
    (charProgress.stats.hp + equipmentBonus.hp + titleBonus.hp) * allStatsPct;
  const playerMaxHp =
    90 + Math.round(effectiveHp * rankMultiplier * hungerMultiplier) * 10;
  const currentHP = charProgress.battleHP ?? playerMaxHp;

  return (
    <div className="StatusColumn">
      <div className={styles.imagesRow}>
        {showImage && (
          <img
            src={playerPath(
              isHungry
                ? `/${player.character}/expressions/hungry.svg`
                : `/${player.character}/default.svg`,
            )}
            className={styles.image}
            onError={handleImageError}
          />
        )}
        {petItem && petNpcType && (
          <img
            src={npcPath(`/${petNpcType}/default.svg`)}
            className={styles.petImage}
          />
        )}
      </div>
      <h2>
        {characterData?.name} - Nv.{charProgress.level}
      </h2>
      <h2 className={styles.rank}>{formatRank(getRank(charProgress.level))}</h2>
      <h2>Classe: {playerClass}</h2>
      <ProgressBar
        value={charProgress.xp}
        max={xpNeeded}
        animationId={`char-xp-${player.character}`}
        level={charProgress.level}
      />
      <p className={styles.xpText}>
        XP: {charProgress.xp}/{xpNeeded} — Nv.{charProgress.level + 1}
      </p>
      <div className={styles.hungerContainer}>
        <div className={styles.hungerText}>
          <Heart />
          <span>HP</span>
          <span>
            {currentHP}/{playerMaxHp}
          </span>
        </div>
        <ProgressBar
          value={currentHP}
          max={playerMaxHp}
          animationId={`char-hp-${player.character}`}
          color={
            currentHP > playerMaxHp * 0.5
              ? "var(--success)"
              : currentHP > playerMaxHp * 0.2
                ? "orange"
                : "red"
          }
        />
      </div>
      <div className={styles.hungerContainer}>
        <div className={styles.hungerText}>
          <Drumstick />
          <span>Fome</span>
          <span>
            {charProgress.hunger}/{MAX_HUNGER}
          </span>
        </div>
        <ProgressBar
          value={charProgress.hunger}
          max={MAX_HUNGER}
          animationId={`char-hunger-${player.character}`}
          color={
            charProgress.hunger > 50
              ? "var(--success)"
              : charProgress.hunger > 20
                ? "orange"
                : "red"
          }
        />
      </div>
      <div className={styles.hungerContainer}>
        <div className={styles.hungerText}>
          <Moon />
          <span>Sono</span>
          <span>
            {charProgress.sleep}/{MAX_SLEEP}
          </span>
        </div>
        <ProgressBar
          value={charProgress.sleep}
          max={MAX_SLEEP}
          animationId={`char-sleep-${player.character}`}
          color={
            charProgress.sleep > 50
              ? "var(--success)"
              : charProgress.sleep > 20
                ? "orange"
                : "red"
          }
        />
      </div>
    </div>
  );
}
