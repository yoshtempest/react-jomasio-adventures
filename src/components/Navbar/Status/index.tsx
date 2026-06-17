import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import { useTitles } from "@/contexts/TitleContext";
import { CHARACTERS } from "@/data/options/characters";
import { useStatusMenu } from "@/hooks/menu/useStatus";
import { asset } from "@/utils/asset";
import {
  EQUIPMENT_SLOTS,
  SLOT_LABELS,
  RANK_COLORS,
} from "@/utils/types/player/equipment";
import type { EquipmentSlot } from "@/utils/types/player/equipment";
import { getTotalArmor } from "@/gameRules/battle/equipment";
import { PassiveSkills } from "../../PassiveSkills";

const STAT_TIPS: Record<string, string> = {
  hp: "Aumenta a vida máxima. Cada ponto concede 10 de HP.",
  strength: "Aumenta o dano de ataques normais. Cada ponto concede +1 de dano.",
  intelligence:
    "Aumenta o dano de ataques especiais. Cada ponto concede +2 de dano.",
  resistance:
    "Aumenta a armadura do personagem. Cada ponto concede 2 de armadura, reduzindo o dano recebido.",
};

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
      resistance: 1,
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
  const userArmor = getTotalArmor(character, stats.resistance);
  const totalShield = bonus.shield;

  const charProgress = progress[player.character];
  const xpNeeded = getXPToNextLevel(charProgress.level);
  const percent = (charProgress.xp / xpNeeded) * 100;
  const characterData = CHARACTERS.find((c) => c.image === player.character);
  const { selectedIndex, options } = useStatusMenu(true);

  const selectedStat = options[selectedIndex];

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
            <p>Armadura: {userArmor}</p>
            {totalShield > 0 && <p>Escudo: {totalShield}</p>}
          </div>
        </div>

        <div className={styles.flexColumn}>
          <p className={styles.title}>Pontos disponíveis: {stats.points}</p>
          {stats.points <= 0 && (
            <p className={styles.title}>Sem pontos disponíveis</p>
          )}

          <div className={selectedIndex === 0 ? "active" : ""}>
            <p>
              Vida: {stats.hp}
              {bonus.hp > 0 ? <span> +{bonus.hp}</span> : ""}
            </p>
          </div>

          <div className={selectedIndex === 1 ? "active" : ""}>
            <p>
              Força: {stats.strength}
              {bonus.strength > 0 ? <span> +{bonus.strength}</span> : ""}
            </p>
          </div>

          <div className={selectedIndex === 2 ? "active" : ""}>
            <p>
              Inteligência: {stats.intelligence}
              {bonus.intelligence > 0 ? (
                <span> +{bonus.intelligence}</span>
              ) : (
                ""
              )}
            </p>
          </div>

          <div className={selectedIndex === 3 ? "active" : ""}>
            <p>
              Resistência: {stats.resistance ?? 1}
            </p>
          </div>

          {selectedStat && STAT_TIPS[selectedStat] && (
            <p className={styles.tip}>{STAT_TIPS[selectedStat]}</p>
          )}
        </div>

        <div className={styles.marginTop}>
          <p className={styles.title}>Equipamentos</p>
          {(EQUIPMENT_SLOTS as EquipmentSlot[]).map((slot) => {
            const item = getEquippedItem(character, slot);
            const label = SLOT_LABELS[slot];
            return (
              <p key={slot} className={styles.fontSize}>
                {label}:{" "}
                {item ? (
                  <span style={{ color: RANK_COLORS[item.rank] }}>
                    {item.name}
                  </span>
                ) : (
                  <span className={styles.italic}>Vazio</span>
                )}
              </p>
            );
          })}
        </div>

        <PassiveSkills characterId={character} />
      </div>
    </div>
  );
}
