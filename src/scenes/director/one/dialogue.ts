import { createDirectorDialogue } from "@/data/dialogues/director/one";

/**
 * O diálogo da cela carrega o callback do teleport do Sistema, então é função
 * e não `dialogueData` estático: quem monta a cena (`features/director`) injeta
 * o `onSistemaDesaparece`.
 */
export const getDirectorDialogue = (onSistemaDesaparece: () => void) =>
  createDirectorDialogue(onSistemaDesaparece);
