import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useTitles } from "@/contexts/TitleContext";
import { CHARACTERS } from "@/data/options/characters";
import { useStatusMenu } from "@/hooks/menu/useStatusMenu";
import { asset } from "@/utils/asset";
import {
  EQUIPMENT_SLOTS,
  SLOT_LABELS,
  RANK_COLORS,
} from "@/utils/types/player/equipment";
import type { EquipmentSlot } from "@/utils/types/player/equipment";

export function Status() {
  const { player, playerClass } = usePlayer();
  const character = player.character;
  const { progress, getXPToNextLevel } = useCharacterProgress();
  const { getTotalBonus, getEquippedItem } = useEquipment();

  const char = progress[character] ?? {
    level: 1,
    xp: 0,
    stats: {
      hp: 1,
      strength: 1,
      intelligence: 1,
      points: 0,
    },
  };

  const stats = char.stats;
  const bonus = getTotalBonus(character);
  const { getBonus } = useTitles();
  const titleBonus = getBonus();

  const totalHp = stats.hp + bonus.hp + titleBonus.hp;
  const totalStrength = stats.strength + bonus.strength + titleBonus.strength;
  const totalIntelligence =
    stats.intelligence + bonus.intelligence + titleBonus.intelligence;

  const userHp = 90 + totalHp * 10;
  const userSpecialDamage = 15 + totalIntelligence * 2;
  const userNormalAttackDamage = 6 + totalStrength;

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const percent = (charProgress.xp / xpNeeded) * 100;
  const characterData = CHARACTERS.find((c) => c.image === player.character);
  const { selectedIndex } = useStatusMenu(true);

  return (
    <div className="containerOfNavbar">
      <h2>Status</h2>

      <div className={styles.flexRow}>
        <div className={styles.flexColumn}>
          <img
            src={asset(`/assets/player/${player.character}/default.svg`)}
            className={styles.image}
          />
          <h2>
            {characterData?.name} - Nv.{charProgress.level}
          </h2>
          <h2>Classe: {playerClass}</h2>
          <div className="xpBar">
            <div className="xpFill" style={{ width: `${percent}%` }} />
          </div>
          <div className={styles.oneLine}>
            <p>HP total: {userHp}</p>
            <p>Dano normal: {userNormalAttackDamage}</p>
            <p>Dano especial: {userSpecialDamage}</p>
          </div>
        </div>

        <div className={styles.flexColumn}>
          <div className={selectedIndex === 0 ? "active" : ""}>
            <p>
              Vida: {stats.hp}
              {bonus.hp > 0 ? (
                <span style={{ color: "#4ade80" }}> +{bonus.hp}</span>
              ) : (
                ""
              )}
            </p>
          </div>

          <div className={selectedIndex === 1 ? "active" : ""}>
            <p>
              Força: {stats.strength}
              {bonus.strength > 0 ? (
                <span style={{ color: "#4ade80" }}> +{bonus.strength}</span>
              ) : (
                ""
              )}
            </p>
          </div>

          <div className={selectedIndex === 2 ? "active" : ""}>
            <p>
              Inteligência: {stats.intelligence}
              {bonus.intelligence > 0 ? (
                <span style={{ color: "#4ade80" }}> +{bonus.intelligence}</span>
              ) : (
                ""
              )}
            </p>
          </div>

          <p>Pontos disponíveis: {stats.points}</p>

          {stats.points <= 0 && <p>Sem pontos disponíveis</p>}

          <div style={{ marginTop: 16 }}>
            <p
              style={{
                fontWeight: "bold",
                color: "#aaa",
                fontSize: 14,
                borderBottom: "1px solid #333",
                paddingBottom: 4,
              }}
            >
              Equipamentos
            </p>
            {(EQUIPMENT_SLOTS as EquipmentSlot[]).map((slot) => {
              const item = getEquippedItem(character, slot);
              const label = SLOT_LABELS[slot];
              return (
                <p key={slot} style={{ fontSize: 12, marginTop: 4 }}>
                  {label}:{" "}
                  {item ? (
                    <span style={{ color: RANK_COLORS[item.rank] }}>
                      {item.name}
                    </span>
                  ) : (
                    <span style={{ color: "#666", fontStyle: "italic" }}>
                      Vazio
                    </span>
                  )}
                </p>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
