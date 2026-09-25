import { getEquipmentStatsBonus } from "@/gameRules/battle/equipment";
import { getHungerMultiplier } from "@/contexts/CharacterProgressContext";
import type { CharacterProgress } from "@/data/characters/defaultProgress";
import type { TitleBonusMap } from "@/utils/types/player/titles";


export function buildCharacterStats(
  baseChar: CharacterProgress,
  equipment: ReturnType<typeof getEquipmentStatsBonus>,
  title: TitleBonusMap,
  rankMultiplier: number,
) {
  if (!baseChar) return baseChar;
  const allStatsPct = 1 + title.percentAllStats / 100;
  const base = {
    hp: (baseChar.stats.hp + equipment.hp + title.hp) * allStatsPct,
    strength:
      (baseChar.stats.strength + equipment.strength + title.strength) *
      allStatsPct,
    intelligence:
      (baseChar.stats.intelligence +
        equipment.intelligence +
        title.intelligence) *
      allStatsPct,
    resistance: baseChar.stats.resistance * allStatsPct,
    tenacity: baseChar.stats.tenacity + (equipment.tenacity ?? 0),
    luck: baseChar.stats.luck + (equipment.luck ?? 0),
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
}