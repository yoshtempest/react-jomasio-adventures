import { statusIconPath, titleBadgePath } from "@/utils/paths";
import type { StatPrimaryKey } from "@/data/player/statList";
import type {
  EquipmentBonusKey,
  StatEffectFormat,
  StatEffectKey,
} from "@/utils/types/player/statEffects";

/**
 * Status derivados que aparecem logo abaixo do stat selecionado no menu de
 * Status, na ordem em que devem ser listados.
 *
 * O índice é a posição em `STATS` (hp, strength, intelligence, resistance,
 * luck) — o mesmo índice que `useStatusMenu` devolve como `selectedIndex`.
 * Resistência e Sorte têm mais de um efeito, e é por isso que o menu mostra
 * vários: mover o cursor entre os stats não pode trocar o número de linhas.
 */
export const STAT_EFFECTS: {
  index: number;
  rows: {
    key: StatEffectKey;
    label: string;
    icon: string;
    format: StatEffectFormat;
  }[];
}[] = [
  {
    index: 0,
    rows: [
      {
        key: "hp",
        label: "HP total",
        icon: statusIconPath("hp.svg"),
        format: "int",
      },
    ],
  },
  {
    index: 1,
    rows: [
      {
        key: "normalDmg",
        label: "Dano normal",
        icon: statusIconPath("basicDamage.svg"),
        format: "int",
      },
    ],
  },
  {
    index: 2,
    rows: [
      {
        key: "specialDmg",
        label: "Dano especial",
        icon: statusIconPath("specialDamage.svg"),
        format: "int",
      },
    ],
  },
  {
    index: 3,
    rows: [
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
      {
        key: "tenacity",
        label: "Tenacidade",
        icon: statusIconPath("tenacity.svg"),
        format: "percent",
      },
    ],
  },
  {
    index: 4,
    rows: [
      {
        key: "luck",
        label: "Sorte",
        icon: statusIconPath("luckChance.svg"),
        format: "percent",
      },
      {
        key: "crit",
        label: "Crítico",
        icon: statusIconPath("critical.svg"),
        format: "percent1",
      },
      {
        key: "evade",
        label: "Esquiva",
        icon: titleBadgePath("enemyMissAttacks.svg"),
        format: "percent1",
      },
    ],
  },
];

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
 * `bonusKey` é a chave correspondente em `EquipmentBonus` — só Resistência
 * não tem uma, porque `getTotalArmor` já embute o equipamento no status
 * derivado e repetir aqui contaria o bônus duas vezes.
 */
export const STATS_MENU_ROWS: {
  key: StatPrimaryKey;
  label: string;
  icon: string;
  bonusKey?: EquipmentBonusKey;
}[] = [
  { key: "hp", label: "Vida", icon: statusIconPath("hp.svg"), bonusKey: "hp" },
  {
    key: "strength",
    label: "Força",
    icon: statusIconPath("strenght.svg"),
    bonusKey: "strength",
  },
  {
    key: "intelligence",
    label: "Inteligência",
    icon: statusIconPath("intelligence.svg"),
    bonusKey: "intelligence",
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
];
