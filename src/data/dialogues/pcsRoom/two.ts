import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const pcsRoomTwoDialogue = defineDialogue([
  ["protagonista", "Ué, cadê Juan Derson?", "crossArms"],
  ["protagonista", "Calma ai, ele tá comendo um mouse?", "why"],
  ["mortoDeFome", "Huhuhu, achei um almoço aqui, carne de rato!"],
  ["protagonista", "Cara isso num é comida não, macho!", "crossArms"],
  {
    who: "mortoDeFome",
    message: "Sai daqui, eu não vou dividir meu almoço com você!",
    pose: "default",
  },
  ["protagonista", "Eu não quero brigar cara, eu não tenho inimigos.", "ops"],
  ["mortoDeFome", "Eu vou te comer então seu bosta! Vem aqui!"],
]);
