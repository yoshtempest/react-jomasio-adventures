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
import {
  getRank,
  formatRank,
  getRankIndex,
  RANKS,
} from "@/gameRules/rank";
import { STAT_TIPS } from "@/data/stats/tips";

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
  const { selectedIndex, options, view } = useStatusMenu(true);

  if (view === "skillTree") {
    return (
      <div className="containerOfNavbar">
        <h2>Árvore de Habilidades</h2>
        <PassiveSkills characterId={character} />
      </div>
    );
  }

  if (view === "ranks") {
    const chars = CHARACTERS.filter((c) => c.selectable);
    return (
      <div className="containerOfNavbar">
        <h2>Ranques</h2>
        <div className={styles.ranksList}>
          {RANKS.map((rank, index) => {
            const minLevel = index * 10;
            const maxLevel = index === RANKS.length - 1
              ? "100+"
              : (index + 1) * 10 - 1;
            const multiplier = 1 + index * 0.1;
            return (
              <div key={String(rank.id)} className={styles.rankRow}>
                <div className={styles.rankInfo}>
                  <span className={styles.rankName}>
                    {rank.label}
                  </span>
                  <span className={styles.rankLevels}>
                    Nv. {minLevel}–{maxLevel}
                  </span>
                  <span className={styles.rankBuff}>
                    {multiplier.toFixed(1)}x
                  </span>
                </div>
                <div className={styles.rankChars}>
                  {chars.map((c) => {
                    const charLevel = progress[c.image]?.level ?? 1;
                    const charRank = getRank(charLevel);
                    if (getRankIndex(charRank) !== index) return null;
                    return (
                      <img
                        key={c.image}
                        src={asset(`/assets/player/${c.image}/face.svg`)}
                        alt={c.name}
                        className={styles.rankCharFace}
                        title={`${c.name} (Nv.${charLevel})`}
                      />
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  const petItem = getEquippedItem(character, "pet");
  const petNpcType = petItem?.id.replace("pet_", "");

  const selectedStat = selectedIndex < options.length ? options[selectedIndex] : null;

  return (
    <div className="containerOfNavbar">
      <h2>Status</h2>

      <div className={styles.flexRow}>
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
        </div>

        <div className={styles.flexColumn}>
          <h2 className={styles.title}>Status</h2>
          <p>HP total: {userHp}</p>
          <p>Dano normal: {userNormalAttackDamage}</p>
          <p>Dano especial: {userSpecialDamage}</p>
          <p>Armadura: {userArmor}</p>
          {totalShield > 0 && <p>Escudo: {totalShield}</p>}
        </div>

        <div className={styles.flexColumn} style={{ width: "14vw" }}>
          <h2 className={styles.title}>Pontos disponíveis: {stats.points}</h2>
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

          <div className={selectedIndex === 4 ? "active" : ""}>
            <p className={styles.subBtn}>Árvore de habilidades</p>
          </div>

          <div className={selectedIndex === 5 ? "active" : ""}>
            <p className={styles.subBtn}>Ver ranques</p>
          </div>

          {selectedStat && STAT_TIPS[selectedStat] && (
            <p className={styles.tip}>{STAT_TIPS[selectedStat]}</p>
          )}
        </div>

        <div className={styles.flexColumn}>
          <h2 className={styles.title}>Equipamentos</h2>
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
      </div>
    </div>
  );
}
