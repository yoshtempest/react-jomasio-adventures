import type { CharacterStats } from "@/data/characters/defaultProgress";

/**
 * Stats que o jogador pode subir no menu de status.
 * `satisfies` garante que cada chave existe em CharacterStats —
 * renomear um stat lá sem atualizar aqui quebra a compilação.
 *
 * A ordem é a do menu e a ordem de leitura do jogador: Força, Resistência,
 * Sorte, Técnica, Espirito.
 */
export const STATS = [
  "strength",
  "resistance",
  "luck",
  "technique",
  "spirit",
] as const satisfies readonly (keyof Omit<CharacterStats, "points">)[];

export type StatPrimaryKey = (typeof STATS)[number];

/**
 * Stats que sobem automaticamente a cada level up (além do ponto disponível).
 *
 * `tenacity` entra aqui mesmo não sendo distribuível pelo menu.
 *
 * `luck` e `technique` são deliberadamente excluídas — só sobem com ponto. As
 * duas alimentam curvas não-lineares (`getLuckBonus`, `getCooldownReduction`),
 * onde um ponto render cada vez menos. Subir sozinho no level up puniria quem
 * distribuiu mal e esvaziaria a decisão do menu; a mesma razão que já valia
 * para a Sorte vale agora para a Técnica.
 */
export const LEVEL_UP_STATS = [
  "strength",
  "resistance",
  "spirit",
  "tenacity",
] as const satisfies readonly (keyof Omit<CharacterStats, "points">)[];
