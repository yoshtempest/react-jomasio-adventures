import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { MAX_HUNGER, getHungerMultiplier } from "@/data/player/hunger";
import { MAX_SLEEP } from "@/data/player/sleep";
import { useTitles } from "@/contexts/TitleContext";
import { getRankMultiplier } from "@/gameRules/rank";
import { getEquipmentStatsBonus } from "@/gameRules/battle/equipment";
import { getMaxMana, getEnergyName, hasManaBar } from "@/gameRules/battle/mana";
import { ProgressBar } from "@/components/Game/ProgressBar";
import styles from "./styles.module.css";
import { Drumstick, Heart, Moon, Sparkles } from "lucide-react";

export function BarsInfos() {
  const { player } = usePlayer();
  const character = player.character;
  const { progress, getXPToNextLevel } = useCharacterProgress();
  const { getBonus } = useTitles();

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);

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
  const maxMana = getMaxMana(character);
  const currentMana = charProgress.battleMana ?? maxMana;

  return (
    <div className={styles.container}>
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
      {hasManaBar(character) && (
        <div className={styles.hungerContainer}>
          <div className={styles.hungerText}>
            <Sparkles />
            <span>{getEnergyName(character)}</span>
            <span>
              {currentMana}/{maxMana}
            </span>
          </div>
          <ProgressBar
            value={currentMana}
            max={maxMana}
            animationId={`char-mana-${player.character}`}
            color={character === "riquelme" ? "#e84118" : "#7fc7ff"}
          />
        </div>
      )}
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
