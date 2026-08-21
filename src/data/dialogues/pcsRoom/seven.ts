import { defineDialogue } from "@/data/dialogues/defineDialogue";

export const pcsRoomSevenDialogue = defineDialogue([
  ["reiMortosFome", "Meu rei, por favor não suje suas mãos batendo em um mísero servo como eu"],
  ["samurion", "Suma daqui seu verme nojento"],
  ["caoFaminto", "Ruf Ruf"],
  ["samurion", "Bixo seboso"],
  ["reiMortosFome", "Fico lisonjeado por receber sua atenção, meu rei"],
  ["samurion", "Vai embora inferior"],
  ["reiMortosFome", "Eu gosto de quando você me trata assim. Uga Uga"],
  ["protagonista", "Que situação nojenta", "crossArms"],
  ["reiMortosFome", "Quem você pensa que é para entrar no alcance de visão do nosso rei?"],
  { who: "mortoDeFome", message: "Acaba com ele, chefe!", name: "Morto de Fome" },
]);
