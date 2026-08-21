import { npcPath, playerPath } from "@/utils/paths";

export const skinShopIfNakamuraDialogue = [
  {
    isPlayer: true,
    name: "Protagonista",
    message: "O que é isso que está acontecendo comigo? Estou mudando?",
  },
  {
    src: npcPath("/bruninho/right.svg"),
    name: "Bruninho",
    message: "Nakamuraa~",
  },
  {
    src: playerPath("/marcelo/nakamura.svg"),
    name: "Marcelinho",
    message: "Bom dia fofo",
  },
  {
    src: npcPath("/bruninho/right.svg"),
    name: "Bruninho",
    message: "Bom dia gatinho",
  },
  {
    src: playerPath("/marcelo/nakamura.svg"),
    name: "Marcelinho",
    message: "Senti saudades >-<",
  },
  {
    src: npcPath("/bruninho/right.svg"),
    name: "Bruninho",
    message: "Me dá um abraçoo",
  },
  {
    src: playerPath("/marcelo/nakamura.svg"),
    name: "Marcelinho",
    message: "Esperei tanto por esse dia!",
  },
  {
    src: npcPath("/bruninho/right.svg"),
    name: "Bruninho",
    message: "Quer ir pro beco?",
  },
  {
    src: playerPath("/marcelo/nakamura.svg"),
    name: "Marcelinho",
    message: "Sério?",
  },
  {
    src: npcPath("/bruninho/right.svg"),
    name: "Bruninho",
    message: "Simm!",
  },
  {
    src: playerPath("/marcelo/nakamura.svg"),
    name: "Marcelinho",
    message: "Entre o céu e a Terra, eu sou o mais honrado.",
  },
] satisfies Dialogue[];
