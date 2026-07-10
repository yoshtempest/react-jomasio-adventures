import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress, MAX_HUNGER } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { CHARACTERS } from "@/data/options/characters";
import { npcPath, playerPath } from "@/utils/paths";
import { getRank, formatRank } from "@/gameRules/rank";
import { ProgressBar } from "@/components/ProgressBar";
import styles from "./styles.module.css";
import { Drumstick } from "lucide-react";

export function CharacterInfo() {
  const { player, playerClass } = usePlayer();
  const character = player.character;
  const { progress, getXPToNextLevel } = useCharacterProgress();
  const { getEquippedItem } = useEquipment();

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const characterData = CHARACTERS.find((c) => c.image === player.character);

  const petItem = getEquippedItem(character, "pet");
  const petNpcType = petItem?.id.replace("pet_", "");

  return (
    <div className="StatusColumn">
      <div className={styles.imagesRow}>
        <img
          src={playerPath(`/${player.character}/default.svg`)}
          className={styles.image}
        />
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
      <h2 className={styles.rank}>
        {formatRank(getRank(charProgress.level))}
      </h2>
      <h2>Classe: {playerClass}</h2>
      <ProgressBar value={charProgress.xp} max={xpNeeded} />
      <p className={styles.xpText}>
        XP: {charProgress.xp}/{xpNeeded} — Nv.{charProgress.level + 1}
      </p>
      <div className={styles.hungerContainer}>
        <div className={styles.hungerText}>
          <Drumstick />
          <span>Fome</span>
          <span>{charProgress.hunger}/{MAX_HUNGER}</span>
        </div>
        <ProgressBar
          value={charProgress.hunger}
          max={MAX_HUNGER}
          color={charProgress.hunger > 50 ? "var(--success)" : charProgress.hunger > 20 ? "orange" : "red"}
        />
      </div>
    </div>
  );
}
