import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const pcsRoomSixDialogue = defineDialogue([
  [
    "reincardion",
    "Você ainda é muito fraco cara, sorte sua que era só um fragmento.",
  ],
  ["reincardion", "Vai por mim, ela é perigosa, fique com isso aqui."],
  ["sistemaJanela", "Ele te deu uma carta... quanta aura!"],
  ["reincardion", "Entregue isso para tia Remedinha e ela irá lhe ajudar."],
  [
    "protagonista",
    "Valeu, inclusive, qual é seu nome? Eu não consigo ler a janela de diálogo sabe?",
    "good",
  ],
  { who: "reincardion", message: "Fui.", pose: "gest" },
]);
