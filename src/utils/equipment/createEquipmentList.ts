import type {
  EquipmentDef,
  EquipmentSlot,
} from "@/utils/types/player/equipment";

/**
 * `EquipmentDef` sem o `slot`: é o que os arquivos de dados declararam, já que
 * o slot é único de cada lista e vem do factory.
 */
type EquipmentDefInput = Omit<EquipmentDef, "slot">;

/**
 * Monta uma lista de equipamentos todos do mesmo slot.
 *
 * O `slot` é declarado uma única vez (primeiro argumento) e aplicado a todos
 * os itens — no tipo e em runtime — para que os arquivos de dados não repitam
 * `slot: "weapon"` linha a linha. O `const` do segundo parâmetro preserva os
 * `id` literais que alimentam a union `EquipmentId` em `@/data/equipment`, e a
 * forma `EquipmentDefInput` mantém a validação de campos que o
 * `satisfies readonly EquipmentDef[]` fazia (inclusive propriedade
 * desconhecida — ver comentário no parâmetro).
 *
 * ```ts
 * export const BOOTS = createEquipmentList("boots", [
 *   { id: "boots_botas_couro", name: "Botas de Couro", rank: 3, stats: { armor: 3 } },
 * ]);
 * ```
 */
export function createEquipmentList<
  S extends EquipmentSlot,
  const T extends readonly EquipmentDefInput[],
>(
  slot: S,
  // A interseção com a forma base é o que faz o TypeScript acusar propriedade
  // desconhecida no item (o `satisfies` que os arquivos faziam antes) — só a
  // restrição genérica deixa passar typo em nome de campo.
  defs: T & readonly EquipmentDefInput[],
): { [K in keyof T]: T[K] & { slot: S } } {
  return (defs as readonly EquipmentDefInput[]).map((def) => ({
    ...def,
    slot,
  })) as unknown as { [K in keyof T]: T[K] & { slot: S } };
}
