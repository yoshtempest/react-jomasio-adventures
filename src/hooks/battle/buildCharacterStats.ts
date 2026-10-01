import { getEquipmentStatsBonus } from "@/gameRules/battle/equipment";

import { getHungerMultiplier } from "@/data/player/hunger";
import type { CharacterProgress } from "@/data/characters/defaultProgress";
import type { RaceStatBonus } from "@/utils/types/character/raceTrait";
import type { TitleBonusMap } from "@/utils/types/player/titles";

/**
 * Soma os bônus raciais aos de equipamento/título.
 *
 * Deliberadamente **antes** de `allStatsPct`, do rank e da fome: trait racial é
 * constituição, não progressão — ela não escala com level-up, enquanto
 * equipamento e título (que o jogador escolhe investir) escalam. Se fosse
 * depois, Draconiano valeria mais no level 30 sem nenhum motivo de design.
 */
function addRaceStats(stats: CharacterProgress["stats"], race: RaceStatBonus) {
  return {
    hp: stats.hp + (race.hp ?? 0),
    strength: stats.strength + (race.strength ?? 0),
    intelligence: stats.intelligence + (race.intelligence ?? 0),
    resistance: stats.resistance + (race.resistance ?? 0),
    tenacity: stats.tenacity + (race.tenacity ?? 0),
    luck: stats.luck + (race.luck ?? 0),
    points: stats.points,
  };
}

export function buildCharacterStats(
  baseChar: CharacterProgress,
  equipment: ReturnType<typeof getEquipmentStatsBonus>,
  title: TitleBonusMap,
  rankMultiplier: number,
  raceStats: RaceStatBonus = {},
) {
  if (!baseChar) return baseChar;
  const race = addRaceStats(baseChar.stats, raceStats);
  const allStatsPct = 1 + title.percentAllStats / 100;
  const base = {
    hp: (race.hp + equipment.hp + title.hp) * allStatsPct,
    strength:
      (race.strength + equipment.strength + title.strength) * allStatsPct,
    intelligence:
      (race.intelligence + equipment.intelligence + title.intelligence) *
      allStatsPct,
    resistance: race.resistance * allStatsPct,
    tenacity: race.tenacity + (equipment.tenacity ?? 0),
    luck: race.luck + (equipment.luck ?? 0),
    points: race.points,
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
