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
import { getNpcStats } from "@/utils/types/npc/npcProgress";
import { getMaxSpecial } from "@/gameRules/battle/special";
import { getRankMultiplier } from "@/gameRules/rank";

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

  const critRate = 1 + weaponCritRate;

  const totalArmor = useMemo(() => {
    return getTotalArmor(player.character, baseChar.stats.resistance);
  }, [player.character, baseChar.stats.resistance]);

  const totalShield = useMemo(() => {
    return getTotalShield(player.character);
  }, [player.character]);

  const totalVampirism = useMemo(() => {
    return getTotalVampirism(player.character);
  }, [player.character]);

  const totalReflect = useMemo(() => {
    return getTotalReflect(player.character);
  }, [player.character]);

  const titleBonus = useMemo(() => {
    return getBonus();
  }, [getBonus]);

  const rankMultiplier = useMemo(() => {
    return getRankMultiplier(baseChar?.level ?? 1);
  }, [baseChar]);

  const char = useMemo(() => {
    if (!baseChar) return baseChar;
    const base = {
      hp: baseChar.stats.hp + equipmentBonus.hp + titleBonus.hp,
      strength:
        baseChar.stats.strength +
        equipmentBonus.strength +
        titleBonus.strength,
      intelligence:
        baseChar.stats.intelligence +
        equipmentBonus.intelligence +
        titleBonus.intelligence,
      resistance: baseChar.stats.resistance,
      points: baseChar.stats.points,
    };
    return {
      ...baseChar,
      stats: {
        hp: Math.round(base.hp * rankMultiplier),
        strength: Math.round(base.strength * rankMultiplier),
        intelligence: Math.round(base.intelligence * rankMultiplier),
        resistance: Math.round(base.resistance * rankMultiplier),
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
    titleBonus,
    playerMaxHp,
    npcMaxHp,
    npcArmor,
    HITS_TO_SPECIAL,
    hasPet,
  };
}
