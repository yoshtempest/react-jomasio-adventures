import { useMemo } from "react";
import { usePlayer } from "@/contexts/PlayerContext";
import { useCharacterProgress } from "@/contexts/CharacterProgressContext";
import { useTitles } from "@/contexts/TitleContext";
import { useEquipment } from "@/contexts/EquipmentContext";
import {
  getEquipmentStatsBonus,
  getWeaponCritRate,
  getTotalArmor,
  getTotalShield,
  getTotalVampirism,
  getTotalReflect,
} from "@/gameRules/battle/equipment";
import { getTenacityReduction } from "@/gameRules/battle/tenacity";
import { getLuckBonus } from "@/gameRules/battle/luck";
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { getMaxSpecial } from "@/gameRules/battle/special";
import { getRankMultiplier } from "@/gameRules/rank";
import { getHungerMultiplier } from "@/contexts/CharacterProgressContext";

type Props = {
  npcLevel: number;
  npcClass: "common" | "rare" | "epic" | "boss" | "legendary";
  difficulty: NpcDifficulty;
  npcPhase: number;
};

export function useBattleStats({
  npcLevel,
  npcClass,
  difficulty,
  npcPhase,
}: Props) {
  const { player, playerClass } = usePlayer();
  const { progress } = useCharacterProgress();
  const { getBonus } = useTitles();
  const { getEquippedItem } = useEquipment();

  const baseChar = progress[player.character];

  const equipmentBonus = useMemo(() => {
    return getEquipmentStatsBonus(player.character);
  }, [player.character]);

  const weaponCritRate = useMemo(() => {
    return getWeaponCritRate(player.character);
  }, [player.character]);

  const titleBonus = useMemo(() => {
    return getBonus();
  }, [getBonus]);

  const totalArmor = useMemo(() => {
    return (
      getTotalArmor(player.character, baseChar.stats.resistance) +
      titleBonus.armor
    );
  }, [player.character, baseChar.stats.resistance, titleBonus.armor]);

  const totalShield = useMemo(() => {
    return getTotalShield(player.character) + titleBonus.shield;
  }, [player.character, titleBonus.shield]);

  const totalVampirism = useMemo(() => {
    return getTotalVampirism(player.character);
  }, [player.character]);

  const totalReflect = useMemo(() => {
    return getTotalReflect(player.character);
  }, [player.character]);

  const totalMaxHpDamage = useMemo(() => {
    return equipmentBonus.maxHpDamage ?? 0;
  }, [equipmentBonus.maxHpDamage]);

  const totalTrueDamage = useMemo(() => {
    return equipmentBonus.trueDamage ?? 0;
  }, [equipmentBonus.trueDamage]);

  const totalTenacity = useMemo(() => {
    return baseChar.stats.tenacity + (equipmentBonus.tenacity ?? 0);
  }, [baseChar.stats.tenacity, equipmentBonus.tenacity]);

  const tenacityReduction = useMemo(() => {
    return getTenacityReduction(totalTenacity);
  }, [totalTenacity]);

  const totalLuck = useMemo(() => {
    return baseChar.stats.luck + (equipmentBonus.luck ?? 0);
  }, [baseChar.stats.luck, equipmentBonus.luck]);

  const luckBonus = useMemo(() => {
    return getLuckBonus(totalLuck);
  }, [totalLuck]);

  const critRate = 1 + weaponCritRate + luckBonus * 100;

  const rankMultiplier = useMemo(() => {
    return getRankMultiplier(baseChar?.level ?? 1);
  }, [baseChar]);

  const char = useMemo(() => {
    if (!baseChar) return baseChar;
    const allStatsPct = 1 + titleBonus.percentAllStats / 100;
    const base = {
      hp: (baseChar.stats.hp + equipmentBonus.hp + titleBonus.hp) * allStatsPct,
      strength:
        (baseChar.stats.strength +
          equipmentBonus.strength +
          titleBonus.strength) *
        allStatsPct,
      intelligence:
        (baseChar.stats.intelligence +
          equipmentBonus.intelligence +
          titleBonus.intelligence) *
        allStatsPct,
      resistance: baseChar.stats.resistance * allStatsPct,
      tenacity: baseChar.stats.tenacity + (equipmentBonus.tenacity ?? 0),
      luck: baseChar.stats.luck + (equipmentBonus.luck ?? 0),
      points: baseChar.stats.points,
    };
    const hungerMultiplier = getHungerMultiplier(baseChar.hunger);
    return {
      ...baseChar,
      stats: {
        hp: Math.round(base.hp * rankMultiplier * hungerMultiplier),
        strength: Math.round(base.strength * rankMultiplier * hungerMultiplier),
        intelligence: Math.round(
          base.intelligence * rankMultiplier * hungerMultiplier,
        ),
        resistance: Math.round(
          base.resistance * rankMultiplier * hungerMultiplier,
        ),
        tenacity: base.tenacity,
        luck: base.luck,
        points: base.points,
      },
    };
  }, [baseChar, equipmentBonus, titleBonus, rankMultiplier]);

  const playerMaxHp = useMemo(() => {
    return 90 + char.stats.hp * 10;
  }, [char.stats.hp]);

  const npcMaxHp = useMemo(() => {
    return getNpcStats(npcLevel, npcClass, difficulty).hp;
  }, [npcLevel, npcClass, difficulty]);

  const npcArmor = useMemo(() => {
    const stats = getNpcStats(npcLevel, npcClass, difficulty);
    return npcPhase === 2 ? Math.round(stats.armor * 1.5) : stats.armor;
  }, [npcLevel, npcClass, difficulty, npcPhase]);

  const HITS_TO_SPECIAL = getMaxSpecial(playerClass);

  const hasPet = getEquippedItem(player.character, "pet") !== null;

  return {
    player,
    playerClass,
    baseChar,
    char,
    equipmentBonus,
    critRate,
    totalArmor,
    totalShield,
    totalVampirism,
    totalReflect,
    totalMaxHpDamage,
    totalTrueDamage,
    totalTenacity,
    tenacityReduction,
    totalLuck,
    luckBonus,
    titleBonus,
    playerMaxHp,
    npcMaxHp,
    npcArmor,
    HITS_TO_SPECIAL,
    hasPet,
  };
}
