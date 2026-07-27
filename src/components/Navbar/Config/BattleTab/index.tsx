import styles from "./styles.module.css";
import { usePlayer } from "@/contexts/PlayerContext";
import { useMemo } from "react";
import { useNavigate } from "react-router";
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
import { getLuckBonus } from "@/gameRules/battle/luck";
import { calculateMaxHpBonus } from "@/gameRules/battle/damage";
import { formatRank, getRank, getRankMultiplier } from "@/gameRules/rank";
import { getHungerMultiplier } from "@/contexts/CharacterProgressContext";
import { getNpcDisplayName } from "@/utils/types/npc/npcNames";
import { CLASS_DATA } from "@/data/npc/class";
import { npcPath, playerPath } from "@/utils/paths";
import { getCharacterStatus } from "@/data/player/stats";
import { ComboList } from "@/components/Navbar/Status/ComboList";
import { BattleCard } from "./BattleCard";
import { CardRedeem } from "./CardRedeem";

type Props = {
  showComboAction: boolean;
  selectedIndex: number;
};

export function BattleTab({ showComboAction, selectedIndex }: Props) {
  const battleInfoCtx = useBattleInfo();
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
  const { getBonus } = useTitles();
  const navigate = useNavigate();

  const isInBattle = player.mode === "battle";

  const playerRank = formatRank(
    getRank(progress[player.character]?.level ?? 1),
  );
  const playerName = localStorage.getItem("playerName") || "Protagonista";

  const battleInfo = battleInfoCtx?.battleInfo;

  const playerStats = useMemo(() => {
    const baseChar = progress[player.character];
    if (!baseChar) return null;

    const equipmentBonus = getEquipmentStatsBonus(player.character);
    const titleBonus = getBonus();
    const rankMultiplier = getRankMultiplier(baseChar.level);
    const hungerMultiplier = getHungerMultiplier(baseChar.hunger);
    const allStatsPct = 1 + titleBonus.percentAllStats / 100;

    const hp = Math.round(
      (baseChar.stats.hp + equipmentBonus.hp + titleBonus.hp) *
        allStatsPct *
        rankMultiplier *
        hungerMultiplier,
    );
    const strength = Math.round(
      (baseChar.stats.strength +
        equipmentBonus.strength +
        titleBonus.strength) *
        allStatsPct *
        rankMultiplier *
        hungerMultiplier,
    );
    const intelligence = Math.round(
      (baseChar.stats.intelligence +
        equipmentBonus.intelligence +
        titleBonus.intelligence) *
        allStatsPct *
        rankMultiplier *
        hungerMultiplier,
    );
    const resistance = Math.round(
      baseChar.stats.resistance *
        allStatsPct *
        rankMultiplier *
        hungerMultiplier,
    );
    const tenacity = baseChar.stats.tenacity + (equipmentBonus.tenacity ?? 0);
    const luck = baseChar.stats.luck + (equipmentBonus.luck ?? 0);
    const luckBonus = getLuckBonus(luck);
    const armor =
      getTotalArmor(player.character, baseChar.stats.resistance) +
      titleBonus.armor;
    const shield = getTotalShield(player.character) + titleBonus.shield;
    const vampirism = getTotalVampirism(player.character);
    const reflect = getTotalReflect(player.character);
    const maxHp = 90 + hp * 10;
    const maxHpDamage = equipmentBonus.maxHpDamage ?? 0;
    const trueDamage = equipmentBonus.trueDamage ?? 0;
    const maxHpDamageBonus = calculateMaxHpBonus(maxHp, maxHpDamage);

    return {
      maxHp,
      strength,
      intelligence,
      resistance,
      tenacity,
      armor,
      shield,
      vampirism,
      reflect,
      luckBonus,
      maxHpDamageBonus,
      trueDamage,
    };
  }, [player.character, progress, getBonus]);

  const winProbability = useMemo(() => {
    if (!battleInfo || !playerStats) return null;
    const enemyTotal =
      battleInfo.npcHp + battleInfo.npcDamage + battleInfo.npcArmor;
    const playerTotal =
      playerStats.maxHp +
      playerStats.strength +
      playerStats.intelligence +
      playerStats.resistance +
      playerStats.tenacity +
      playerStats.armor +
      playerStats.shield +
      playerStats.vampirism +
      playerStats.reflect +
      playerStats.maxHpDamageBonus +
      playerStats.trueDamage;
    if (playerTotal + enemyTotal === 0) return 50;
    return Math.round((playerTotal / (playerTotal + enemyTotal)) * 100);
  }, [battleInfo, playerStats]);

  const classData = battleInfo ? CLASS_DATA[battleInfo.npcClass] : null;

  const playerSummary = playerStats
    ? getCharacterStatus({
        hp: playerStats.maxHp,
        strenght: playerStats.strength,
        intelligence: playerStats.intelligence,
        resistance: playerStats.resistance,
        tenacity: playerStats.tenacity,
        armor: playerStats.armor,
        shield: playerStats.shield,
        vampirism: playerStats.vampirism,
        reflect: playerStats.reflect,
        maxHpDamageBonus: playerStats.maxHpDamageBonus,
        trueDamage: playerStats.trueDamage,
      })
    : null;

  return (
    <div className={styles.battleContainer}>
      {battleInfo && playerStats && classData && playerSummary && (
        <>
          <div className={styles.battleEntities}>
            <BattleCard
              spriteSrc={playerPath(`/${player.character}/default.svg`)}
              name={playerName}
              level={battleInfo.npcLevel}
              rank={playerRank}
              stats={playerSummary}
            />
            <h2>VS</h2>
            <BattleCard
              spriteSrc={npcPath(`/${battleInfo.npcType}/right.svg`)}
              name={getNpcDisplayName(battleInfo.npcType)}
              subtitle={
                <span className={styles.npcClassLabel}>
                  Classe:{" "}
                  <span style={{ color: classData.color }}>
                    {classData.label}
                  </span>
                </span>
              }
              level={battleInfo.npcLevel}
              rank={playerRank}
              stats={[
                { label: "HP", value: Math.round(battleInfo.npcHp) },
                { label: "Dano", value: Math.round(battleInfo.npcDamage) },
                { label: "Armadura", value: Math.round(battleInfo.npcArmor) },
              ]}
            />
          </div>

          <h2 className={styles.marginTop}>Chance de Vitória</h2>
          <div className={styles.probabilityBar}>
            <div
              className={styles.probabilityFill}
              style={{ width: `${winProbability ?? 0}%` }}
            />
            <span className={styles.probabilityText}>
              {winProbability ?? 0}%
            </span>
          </div>
          <ComboList characterId={player.character} />
          <div
            className={`${styles.toggleItem} ${selectedIndex === 0 ? styles.selected : ""}`}
          >
            {selectedIndex === 0 && <span className={styles.cursor}>▼</span>}
            <h2>Exibir botão de combo: {showComboAction ? "ON" : "OFF"}</h2>
          </div>
        </>
      )}

      {!battleInfo && !isInBattle && (
        <>
          <p className={styles.empty}>
            Abra as configurações durante uma batalha para ver as informações.
          </p>
          <div
            className={`${styles.toggleItem} ${selectedIndex === 1 ? styles.selected : ""}`}
          >
            {selectedIndex === 1 && <span className={styles.cursor}>▼</span>}
            <button
              className={styles.trainingButton}
              onClick={() => navigate("/training")}
              type="button"
            >
              Modo Treino
            </button>
          </div>
          <CardRedeem isSelected={selectedIndex === 2} />
        </>
      )}
    </div>
  );
}
