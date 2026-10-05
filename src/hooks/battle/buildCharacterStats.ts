import { getEquipmentStatsBonus } from "@/gameRules/battle/equipment";

import { getHungerMultiplier } from "@/data/player/hunger";
import type { CharacterProgress } from "@/data/characters/defaultProgress";
import type { TitleBonusMap } from "@/utils/types/player/titles";
import { TECHNIQUE_CDR_PER_POINT } from "@/gameRules/battle/cooldownReduction";

export function buildCharacterStats(
  baseChar: CharacterProgress,
  equipment: ReturnType<typeof getEquipmentStatsBonus>,
  title: TitleBonusMap,
  rankMultiplier: number,
) {
  if (!baseChar) return baseChar;
  const allStatsPct = 1 + title.percentAllStats / 100;
  const base = {
    // HP virou derivado da Resistência: o stat `hp` saiu do menu de pontos, então
    // o pool de vida soma resistência mais o bônus de HP de equipamento/título.
    // A troca preserva o level up antigo — antes ele subia `hp` E `resistance`,
    // agora sobe só `resistance`, que carrega as duas coisas.
    hp: (baseChar.stats.resistance + equipment.hp + title.hp) * allStatsPct,
    strength:
      (baseChar.stats.strength + equipment.strength + title.strength) *
      allStatsPct,
    technique:
      (baseChar.stats.technique + equipment.technique + title.technique) *
      allStatsPct,
    spirit:
      (baseChar.stats.spirit + equipment.spirit + title.spirit) * allStatsPct,
    resistance: baseChar.stats.resistance * allStatsPct,
    // CDR é cru e fica de fora do rank e da fome: os dois escalam DANO, e uma
    // fome baixa não pode encurtar o cooldown de uma habilidade.
    cooldownReduction:
      baseChar.stats.technique * TECHNIQUE_CDR_PER_POINT +
      equipment.cooldownReduction +
      title.cooldownReduction,
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
      technique: Math.round(base.technique * rankMultiplier * hungerMultiplier),
      spirit: Math.round(base.spirit * rankMultiplier * hungerMultiplier),
      resistance: Math.round(
        base.resistance * rankMultiplier * hungerMultiplier,
      ),
      cooldownReduction: base.cooldownReduction,
      tenacity: base.tenacity,
      luck: base.luck,
      points: base.points,
    },
  };
}
