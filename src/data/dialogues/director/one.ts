import { defineDialogue } from "@/data/dialogues/defineDialogue";

/**
 * Cutscene da cela: o jogador acorda preso, a janela de sistema destrava e ele
 * manda o Sistema embora. A última fala **não** bloqueia o diálogo — ela só
 * aciona `onSistemaDesaparece`, que faz o Sistema piscar fora antes de a cena
 * redirecionar para a sala do diretor (o `delay` do evento `navigate` segura a
 * troca de sala pelo tempo do efeito).
 */
export const createDirectorDialogue = (onSistemaDesaparece: () => void) =>
  defineDialogue([
    [
      "protagonista",
      "Tinha que ser... Só porque eu estava com meu Nokia Tijolão na cintura, Jhowsimar me prendeu e me jogou nessa cela.",
      "crossArms",
    ],
    ["janelaSistema", "Janela de sistema desbloqueada!"],
    ["protagonista", "Mas que poha é essa?", "why"],
    ["janelaSistema", "Se vira ai. Não sou pago pra isso"],
    {
      who: "protagonista",
      message: "Então vai se fu- não vou me estressar com isso.",
      expression: "angry",
      onConfirm: onSistemaDesaparece,
    },
  ]);
