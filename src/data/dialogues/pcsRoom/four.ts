import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const pcsRoomFourDialogue = defineDialogue([
  ["fragmentoVandinha", "Foi você que bateu no meu bêbê, não foi?"],
  ["protagonista", "Aquele de agora a pouco?", "crossArms"],
  { who: "fragmentoVandinha", message: "EU SABIA! ESTOU DE OLHO EM VOCÊ A MUITO TEMPO!", pose: "default" },
]);
