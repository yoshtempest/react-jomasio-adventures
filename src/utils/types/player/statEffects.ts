import type { StatPrimaryKey } from "@/data/player/statList";
import type { EquipmentBonus } from "@/utils/types/player/equipment";

export type StatEffectKey =
  | "hp"
  | "normalDmg"
  | "specialDmg"
  | "armor"
  | "tenacity"
  | "luck"
  | "crit"
  | "evade";

/** `int` sem sufixo, `percent` inteiro com `%`, `percent1` com 1 casa. */
export type StatEffectFormat = "int" | "percent" | "percent1";

/**
 * Chaves de `EquipmentBonus` que um stat primário pode exibir. Derivada do
 * tipo real para não divergir: Resistência não entra porque o bônus de
 * armadura vive em `getTotalArmor`, não no bônus somado.
 */
export type EquipmentBonusKey = Extract<keyof EquipmentBonus, StatPrimaryKey>;
