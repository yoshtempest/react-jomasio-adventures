import { statusIconPath, titleBadgePath } from "@/utils/paths";
import { STATS, type StatPrimaryKey } from "@/data/player/statList";
import type {
  EquipmentBonusKey,
  StatEffectFormat,
  StatEffectKey,
} from "@/utils/types/player/statEffects";

export type StatEffectRow = {
  key: StatEffectKey;
  label: string;
  icon: string;
  format: StatEffectFormat;
};

/**
 * Status derivados de cada stat primário, na ordem em que aparecem abaixo da
 * linha dele no menu de Status.
 *
 * Indexado por `StatPrimaryKey` e não por posição de menu: o menu navega por
 * índice, mas o dado fica preso ao nome do stat. Assim reorderar `STATS` não
 * troca a lista de efeitos de um stat por outro em silêncio, e um stat novo
 * não compila enquanto esta tabela não for preenchida.
 */
export const STAT_EFFECTS: Record<StatPrimaryKey, StatEffectRow[]> = {
  strength: [
    {
      key: "normalDmg",
      label: "Dano físico",
      icon: statusIconPath("basicDamage.svg"),
      format: "int",
    },
    {
      key: "tenacity",
      label: "Tenacidade",
      icon: statusIconPath("tenacity.svg"),
      format: "percent",
    },
  ],
  resistance: [
    {
      key: "hp",
      label: "Vida máxima",
      icon: statusIconPath("hp.svg"),
      format: "int",
    },
    {
      key: "physicalArmor",
      label: "Armadura física",
      icon: statusIconPath("armor.svg"),
      format: "int",
    },
    {
      key: "magicalArmor",
      label: "Armadura mágica",
      icon: statusIconPath("armor.svg"),
      format: "int",
    },
  ],
  luck: [
    {
      key: "crit",
      label: "Crítico",
      icon: statusIconPath("critical.svg"),
      format: "percent1",
    },
    {
      key: "evade",
      label: "Chance de esquiva",
      icon: titleBadgePath("enemyMissAttacks.svg"),
      format: "percent1",
    },
    {
      key: "dropChance",
      label: "Drops",
      icon: statusIconPath("luckChance.svg"),
      format: "percent1",
    },
  ],
  technique: [
    {
      key: "techniqueDmg",
      label: "Dano de habilidades",
      icon: statusIconPath("specialDamage.svg"),
      format: "int",
    },
    {
      key: "cooldownReduction",
      label: "Redução de cooldown",
      icon: statusIconPath("cooldownReduction.svg"),
      format: "percent1",
    },
  ],
  spirit: [
    {
      key: "spiritDmg",
      label: "Dano mágico",
      icon: statusIconPath("spirit.svg"),
      format: "int",
    },
    {
      key: "maxMana",
      label: "Energia máxima",
      icon: statusIconPath("energy.svg"),
      format: "int",
    },
  ],
};

/**
 * Linhas de efeito do stat na posição `index` do menu.
 *
 * É a ponte entre a navegação por índice do menu e o dado preso à chave do
 * stat — `STATS[index]` é a única forma de resolver os dois.
 */
export function getStatEffectRows(index: number): StatEffectRow[] {
  const key = STATS[index];
  return key ? (STAT_EFFECTS[key] ?? []) : [];
}

export function formatStatValue(
  value: number,
  format: StatEffectFormat,
): string {
  if (format === "int") return String(value);
  return `${format === "percent1" ? value.toFixed(1) : value}%`;
}

/**
 * Stats primários que o menu de Status distribui com os pontos disponíveis.
 *
 * A ordem vem de `STATS`, não de uma lista própria aqui: são as duas listas que
 * precisam concordar, e dois campos de ordem independentes divergem sozinhos.
 *
 * `bonusKey` é a chave correspondente em `EquipmentBonus` — só Resistência não
 * tem uma, porque `getTotalArmor` já embute o equipamento no status derivado e
 * repetir aqui contaria o bônus duas vezes.
 */
export const STATS_MENU_ROWS: {
  key: StatPrimaryKey;
  label: string;
  icon: string;
  bonusKey?: EquipmentBonusKey;
}[] = [
  {
    key: "strength",
    label: "Força",
    icon: statusIconPath("strenght.svg"),
    bonusKey: "strength",
  },
  {
    key: "resistance",
    label: "Resistência",
    icon: statusIconPath("armor.svg"),
  },
  {
    key: "luck",
    label: "Sorte",
    icon: statusIconPath("luckChance.svg"),
    bonusKey: "luck",
  },
  {
    key: "technique",
    label: "Técnica",
    icon: statusIconPath("technique.svg"),
    bonusKey: "technique",
  },
  {
    key: "spirit",
    label: "Espírito",
    icon: statusIconPath("spirit.svg"),
    bonusKey: "spirit",
  },
];
