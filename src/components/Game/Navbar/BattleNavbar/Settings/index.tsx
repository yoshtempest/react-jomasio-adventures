import styles from "./styles.module.css";
import { getNpcDisplayName } from "@/data/npc/displayNames";
import { npcPath, playerPath } from "@/utils/paths";
import { ComboList } from "@/components/Game/Navbar/ExploreNavbar/Status/ComboList";
import { CHARACTER_ELEMENT_TYPES } from "@/data/types/characterElementTypes";
import { getNpcElementTypes } from "@/data/types/npcElementTypes";
import { BattleCard } from "./BattleCard";
import { ElementTable } from "./ElementTable";

import { usePlayer } from "@/contexts/PlayerContext";
import { useEffect, useMemo, useRef, useState } from "react";
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
import { formatRank, getRank, getRankMultiplier } from "@/gameRules/rank";
import { getHungerMultiplier } from "@/contexts/CharacterProgressContext";
import { CLASS_DATA } from "@/data/npc/class";
import { getCharacterStatus } from "@/data/player/stats";
import { combatService } from "@/services/combat";


export function Settings() {

  const battleInfoCtx = useBattleInfo();
  const { player } = usePlayer();
  const { progress } = useCharacterProgress();
  const { getBonus } = useTitles();

  const playerLevel = progress[player.character]?.level ?? 1;
  const playerRank = formatRank(getRank(playerLevel));
  const playerName = localStorage.getItem("playerName") || "Protagonista";

  const battleInfo = battleInfoCtx?.battleInfo;
  const npcRank = battleInfo
    ? formatRank(getRank(battleInfo.npcLevel))
    : playerRank;


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
    const luckBonus = combatService.getLuckBonus(luck);
    const armor =
      getTotalArmor(player.character, baseChar.stats.resistance) +
      titleBonus.armor;
    const shield = getTotalShield(player.character) + titleBonus.shield;
    const vampirism = getTotalVampirism(player.character);
    const reflect = getTotalReflect(player.character);
    const maxHp = 90 + hp * 10;
    const maxHpDamage = equipmentBonus.maxHpDamage ?? 0;
    const trueDamage = equipmentBonus.trueDamage ?? 0;
    const maxHpDamageBonus = combatService.calculateMaxHpBonus(maxHp, maxHpDamage);

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

    const playerTypes = CHARACTER_ELEMENT_TYPES[player.character] ?? [];
    const npcTypes = getNpcElementTypes(battleInfo.npcType);
    const playerElementMultiplier = combatService.getElementMultiplier(playerTypes, npcTypes);
    const npcElementMultiplier = combatService.getElementMultiplier(npcTypes, playerTypes);

    const enemyTotal =
      (battleInfo.npcHp + battleInfo.npcDamage + battleInfo.npcArmor) *
      npcElementMultiplier;
    const playerTotal =
      (playerStats.maxHp +
        playerStats.strength +
        playerStats.intelligence +
        playerStats.resistance +
        playerStats.tenacity +
        playerStats.armor +
        playerStats.shield +
        playerStats.vampirism +
        playerStats.reflect +
        playerStats.maxHpDamageBonus +
        playerStats.trueDamage) *
      playerElementMultiplier;
    if (playerTotal + enemyTotal === 0) return 50;
    return Math.round((playerTotal / (playerTotal + enemyTotal)) * 100);
  }, [battleInfo, playerStats, player.character]);

  const [displayedWin, setDisplayedWin] = useState(0);
  const displayedWinRef = useRef(0);

  useEffect(() => {
    if (winProbability === null) return;

    const from = displayedWinRef.current;
    const to = winProbability;
    const duration = 2000;
    let segStart = 0;
    let rafId = 0;

    function tick(ts: number) {
      if (segStart === 0) segStart = ts;
      const elapsed = ts - segStart;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - (1 - t) * (1 - t) * (1 - t);
      const value = from + (to - from) * eased;
      displayedWinRef.current = value;
      setDisplayedWin(value);

      if (t < 1) {
        rafId = requestAnimationFrame(tick);
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [winProbability, playerStats]);

  const classData = battleInfo ? CLASS_DATA[battleInfo.npcClass] : null;

  const playerSummary = playerStats
    ? getCharacterStatus({
        hp: playerStats.maxHp,
        strength: playerStats.strength,
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
      <div className="containerOfNavbar">
        <div className={`${styles.battleContainer} `}>
          {battleInfo && playerStats && classData && playerSummary && (
            <>
              <h2 className={styles.center}>Configurações de Batalha</h2>
              <div className={styles.battleEntities}>
                <BattleCard
                  spriteSrc={playerPath(`/${player.character}/default.svg`)}
                  name={playerName}
                  level={playerLevel}
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
                  rank={npcRank}
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
                  style={{ width: `${displayedWin}%` }}
                />
                <span className={styles.probabilityText}>
                  {Math.round(displayedWin)}%
                </span>
              </div>
              <ComboList characterId={player.character} />

            <ElementTable
              playerElementTypes={CHARACTER_ELEMENT_TYPES[player.character] ?? []}
              npcElementTypes={
                battleInfo ? getNpcElementTypes(battleInfo.npcType) : []
              }
            />
          </>
        )}
      </div>
    </div>
  );
}
