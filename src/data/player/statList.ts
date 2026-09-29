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

export type StatPrimaryKey = (typeof STATS)[number];

/**
 * Stats que sobem automaticamente a cada level up (além do ponto disponível).
 * `tenacity` entra aqui mesmo não sendo distribuível pelo menu, e `luck` é
 * deliberadamente excluída — só sobe com pontos.
 */
export const LEVEL_UP_STATS = [
  "hp",
  "strength",
  "intelligence",
  "resistance",
  "tenacity",
] as const satisfies readonly (keyof Omit<CharacterStats, "points" | "luck">)[];
