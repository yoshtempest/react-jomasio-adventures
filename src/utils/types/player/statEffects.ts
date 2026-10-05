import type { StatPrimaryKey } from "@/data/player/statList";
import type { EquipmentBonus } from "@/utils/types/player/equipment";

/**
 * Status derivados que um stat primário pode exibir no menu de Status.
 *
 * Cada chave precisa existir em `DerivedStats` — o menu lê o valor direto por
 * `derived[row.key]`, então uma chave que não exista devolveria `undefined`
 * formatado como `NaN` em vez de quebrar o build.
 */
export type StatEffectKey =
  /** Vida máxima, derivada da Resistência. */
  | "hp"
  /** Dano do ataque básico, derivado da Força. */
  | "normalDmg"
  /** Dano do special físico, derivado da Técnica. */
  | "techniqueDmg"
  /** Dano do special mágico, derivado do Espírito. */
  | "spiritDmg"
  /** Colunas separadas: o jogador precisa ver qual golpe a armadura segura. */
  | "physicalArmor"
  | "magicalArmor"
  | "tenacity"
  | "crit"
  | "evade"
  /** Chance de roll extra de drop, derivada da Sorte. */
  | "dropChance"
  /** Redução de cooldown efetiva (já passada pela curva). */
  | "cooldownReduction"
  /** Energia máxima, derivada do Espírito. */
  | "maxMana";

/** `int` sem sufixo, `percent` inteiro com `%`, `percent1` com 1 casa. */
export type StatEffectFormat = "int" | "percent" | "percent1";

/**
 * Chaves de `EquipmentBonus` que um stat primário pode exibir. Derivada do
 * tipo real para não divergir: Resistência não entra porque o bônus de
 * armadura vive em `getTotalArmor`, não no bônus somado.
 */
export type EquipmentBonusKey = Extract<keyof EquipmentBonus, StatPrimaryKey>;
