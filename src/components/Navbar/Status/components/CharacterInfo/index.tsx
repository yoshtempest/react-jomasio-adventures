import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress, MAX_HUNGER } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { CHARACTERS } from "@/data/options/characters";
import { asset } from "@/utils/asset";
import { getRank, formatRank } from "@/gameRules/rank";
import styles from "../../styles.module.css";
import { Drumstick } from "lucide-react";

export function CharacterInfo() {
  const { player, playerClass } = usePlayer();
  const character = player.character;
  const { progress, getXPToNextLevel } = useCharacterProgress();
  const { getEquippedItem } = useEquipment();

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const percent = (charProgress.xp / xpNeeded) * 100;
  const characterData = CHARACTERS.find((c) => c.image === player.character);

  const petItem = getEquippedItem(character, "pet");
  const petNpcType = petItem?.id.replace("pet_", "");

  return (
    <div className={styles.flexColumn}>
      <div className={styles.imagesRow}>
        <img
          src={asset(`/assets/player/${player.character}/default.svg`)}
          className={styles.image}
        />
        {petItem && petNpcType && (
          <img
            src={asset(`/assets/npcs/${petNpcType}/default.svg`)}
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
      <div className="xpBar">
        <div className="xpFill" style={{ width: `${percent}%` }} />
      </div>
      <p className={styles.xpText}>
        XP: {charProgress.xp}/{xpNeeded} — Nv.{charProgress.level + 1}
      </p>
      <div style={{ width: "100%", marginTop: 8 }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, color: "var(--text-muted)" }}>
          <Drumstick />
          <span>Fome</span>
          <span>{charProgress.hunger}/{MAX_HUNGER}</span>
        </div>
        <div style={{ width: "100%", height: 8, background: "var(--surface-secondary)", borderRadius: 4, overflow: "hidden" }}>
          <div style={{
            width: `${(charProgress.hunger / MAX_HUNGER) * 100}%`,
            height: "100%",
            background: charProgress.hunger > 50 ? "var(--success)" : charProgress.hunger > 20 ? "orange" : "red",
            borderRadius: 4,
            transition: "width 0.3s",
          }} />
        </div>
      </div>
    </div>
  );
}
