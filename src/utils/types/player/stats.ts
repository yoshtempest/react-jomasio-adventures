import type { CharacterStats } from "@/data/characters/defaultProgress";

/**
 * Stats que o jogador pode subir no menu de status.
 * `satisfies` garante que cada chave existe em CharacterStats —
 * renomear um stat lá sem atualizar aqui quebra a compilação.
 */
export const STATS = [
  "hp",
  "strength",
  "intelligence",
  "resistance",
  "luck",
] as const satisfies readonly (keyof Omit<CharacterStats, "points">)[];

export type StatType = (typeof STATS)[number];
