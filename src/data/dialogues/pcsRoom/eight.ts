import { npcPath, playerPath } from "@/utils/paths";

export const pcsRoomEightDialogue = [
  {
    src: npcPath("/hungryKing/default.svg"),
    name: "Rei dos Mortos de Fome",
    message:
      "Meu rei, não acredite nele, eu gosto de apanhar apenas de você tá bom?",
  },
  {
    src: playerPath("/samuel/default.svg"),
    name: "Samurion",
    message: "Some daqui",
  },
  {
    src: npcPath("/hungryDog/walk.svg"),
    name: "Cão Faminto",
    message: "Ruf Ruf",
  },
  {
    isPlayer: true,
    name: "Protagonista",
    message: "Vamos embora Samurion, não se junte com essa gentalha",
    expression: "crossArms",
  },
  {
    src: npcPath("/hungryKing/default.svg"),
    name: "Rei dos Mortos de Fome",
    message: "Vou embora dessa vez, mas saíba que eu voltarei",
  },
] satisfies Dialogue[];
