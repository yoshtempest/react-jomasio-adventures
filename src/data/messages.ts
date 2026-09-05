/**
 * Texto de interação exibido ao jogador.
 *
 * Mensagem repetida vive numa constante só: "Porta trancada" aparecia em seis
 * arquivos de cena, e mudar o texto exigia caçar todas as cópias. O que muda
 * com o contexto (nível exigido, item coletado) é função, não string solta.
 */

/** Rótulo do hint de interação, exibido acima do tile. */
export const INTERACTION_LABELS = {
  TALK: "[L] Conversar",
  INTERACT: "[L] Interagir",
  PICK_UP: "[L] Pegar",
  COLLECT: "[L] Recolher",
  OPEN: "[L] Abrir",
  MINE: "[L] Minerar",
  CHOP: "[L] Lenhar",
} as const;

/** Motivo pelo qual uma passagem não liberou. */
export const BLOCKED_MESSAGES = {
  LOCKED_DOOR: "Porta trancada",
  BLOCKED_PASSAGE: "Passagem bloqueada",
} as const;

/** Popups de interação com cenário. */
export const POPUP_MESSAGES = {
  DOOR_LOCKED: "Essa porta está trancada.",
  KEY_USED: "Você usou a chave.",
  ROCK_ON_COOLDOWN: "A rocha ainda está se recuperando...",
  ROCK_WITHOUT_ORE: "Esta rocha não contém minério conhecido.",
  TREE_WITHOUT_WOOD: "Esta árvore não produz madeira conhecida.",
  BOOK_SECRET_PASSAGE: "O livro revela uma passagem secreta!",
  BOOK_ORDINARY: "Um livro empoeirado. Nada de especial.",
} as const;

/** Ferramenta que falta para a ação de profissão. */
export const TOOL_REQUIRED_MESSAGES = {
  PICKAXE: "Você precisa equipar uma picareta para minerar.",
  AXE: "Você precisa equipar um machado para lenhar.",
} as const;

/**
 * Mensagem de nível insuficiente numa ação de profissão.
 *
 * Args:
 *     profession (string): nome da profissão exigida.
 *     requiredLevel (number): nível mínimo do recurso.
 *     currentLevel (number): nível atual do jogador na profissão.
 *     action (string): o que ele tentou fazer, com o alvo.
 *
 * Returns:
 *     O texto pronto para o popup.
 */
export function professionLevelRequired(
  profession: string,
  requiredLevel: number,
  currentLevel: number,
  action: string,
): string {
  return `Você precisa ser ${profession} nv.${requiredLevel} para ${action}. (você é nv.${currentLevel})`;
}

/**
 * Resumo de uma coleta de profissão.
 *
 * Args:
 *     action (string): frase da ação concluída, já com o alvo.
 *     summary (string): itens obtidos, formatados.
 *     xpGained (number): XP ganho na interação.
 *     profession (string): nome da profissão que recebeu o XP.
 *
 * Returns:
 *     O texto pronto para o popup, sem a nota de XP quando ele é zero.
 */
export function gatherResult(
  action: string,
  summary: string,
  xpGained: number,
  profession: string,
): string {
  const xpNote = xpGained > 0 ? ` (+${xpGained} XP de ${profession})` : "";
  return `${action} Obteve: ${summary}.${xpNote}`;
}
