import { createItems } from "@/utils/items/createItem";

export const KEYS = createItems({
  director_key: {
    image: "/assets/items/keys/director.svg",
    name: "Chave enferrujada",
    description:
      "Uma chave velha e enferrujada. Deve abrir alguma porta por aí.",
    type: "key",
  },
  common_key: {
    image: "/assets/items/keys/common.svg",
    name: "Chave Simples",
    description: "Uma chave simples. Abre baús comuns.",
    type: "key",
  },
  rare_key: {
    image: "/assets/items/keys/rare.svg",
    name: "Chave Rara",
    description: "Uma chave reluzente. Abre baús raros.",
    type: "key",
  },
  epic_key: {
    image: "/assets/items/keys/epic.svg",
    name: "Chave Épica",
    description: "Uma chave energizada. Abre baús épicos.",
    type: "key",
  },
  boss_key: {
    image: "/assets/items/keys/boss.svg",
    name: "Chave de Chefão",
    description: "Uma chave temível. Abre baús de chefão.",
    type: "key",
  },
  legendary_key: {
    image: "/assets/items/keys/legendary.svg",
    name: "Chave Lendária",
    description: "Uma chave mística. Abre baús lendários.",
    type: "key",
  },
} as const);
