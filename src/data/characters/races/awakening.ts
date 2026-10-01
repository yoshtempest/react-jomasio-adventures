import type { ElementType } from "@/utils/types/battle/element";

/**
 * Despertar racial: tipagem que a criatura ganha ao atingir um nível.
 *
 * É o único uso de `CharacterRace.extraTypes` — a union que a resolução de
 * tipagens já sabia ler, e que nenhum personagem populava até agora. Manter o
 * despertar em dado separado (e não em `CHARACTER_RACES`) é o que permite que
 * ele dependa de nível sem transformar a tabela de raças em função.
 */
export type RaceAwakening = {
  /** Nome do despertar, exibido no menu de Status. */
  label: string;
  /** Nível a partir do qual a tipagem entra em vigor. */
  level: number;
  types: readonly ElementType[];
};

/**
 * Despertares por personagem. Personagem sem entrada nunca desperta.
 *
 * As tipagens são sempre adicionais: as herdadas continuam valendo, então
 * acordar é *ganhar* uma coluna na tabela elemental em vez de trocar a racial.
 *
 * Tipado como `Partial<Record<CharacterId, ...>>` (e não `satisfies`) para que
 * indexar por um personagem sem despertar type-check: é o caso normal, não
 * erro. A checagem de chave inválida continua valendo.
 */
export const RACE_AWAKENINGS: Partial<Record<CharacterId, RaceAwakening>> = {
  levi: { label: "Sangue em brasa", level: 15, types: ["Pyrus"] },
  lucas: { label: "Fio do vento", level: 15, types: ["Ventus"] },
  camilly: { label: "Rugido de fera", level: 15, types: ["Nympha"] },
  samuel: { label: "Pedra viva", level: 20, types: ["Metallum"] },
  marcelo: { label: "Brasa na sombra", level: 20, types: ["Pyrus"] },
};

/** Despertar vigente do personagem no nível dado (`null` se ainda não acordou). */
export function getRaceAwakening(
  character: CharacterId,
  level: number,
): RaceAwakening | null {
  const awakening = RACE_AWAKENINGS[character];
  if (!awakening || level < awakening.level) return null;
  return awakening;
}

/**
 * Tipagens efetivas com o despertar aplicado.
 *
 * `baseTypes` é a resolução herdada (raças + extras declarados); o despertar
 * só acrescenta o que ainda não está na lista, então acordar duas vezes com a
 * mesma tipagem não cria coluna duplicada.
 */
export function applyAwakening(
  baseTypes: readonly ElementType[],
  character: CharacterId,
  level: number,
): ElementType[] {
  const awakening = getRaceAwakening(character, level);
  if (!awakening) return [...baseTypes];

  const result = [...baseTypes];
  for (const type of awakening.types) {
    if (!result.includes(type)) result.push(type);
  }
  return result;
}
