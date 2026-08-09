import { npcPath } from "@/utils/paths";

export const pcsRoomSixDialogue = [
  {
    src: npcPath("/reincardion/right.svg"),
    name: "Reincardion",
    message:
      "Você ainda é muito fraco cara, sorte sua que era só um fragmento.",
  },
  {
    src: npcPath("/reincardion/right.svg"),
    name: "Reincardion",
    message: "Vai por mim, ela é perigosa, fique com isso aqui.",
  },
  {
    src: npcPath("/system/right.svg"),
    name: "Sistema",
    message: "Ele te deu uma carta... quanta aura!",
  },
  {
    src: npcPath("/reincardion/right.svg"),
    name: "Reincardion",
    message: "Entregue isso para tia Remedinha e ela irá lhe ajudar.",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message:
      "Valeu, inclusive, qual é seu nome? Eu não consigo ler a janela de diálogo sabe?",
  },
  {
    src: npcPath("/reincardion/gest.svg"),
    name: "Reincardion",
    message: "Fui.",
  },
];
