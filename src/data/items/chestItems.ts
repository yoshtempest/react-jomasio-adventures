import { createItems } from "@/utils/items/createItem";

export const CHESTS = createItems({
  common_chest: {
    image: "/assets/items/chests/common.svg",
    name: "Baú Simples",
    description: "Um baú de madeira. Quem sabe o que tem dentro?",
    type: "chest",
  },
  rare_chest: {
    image: "/assets/items/chests/rare.svg",
    name: "Baú Raro",
    description: "Um baú prateado. Parece ter coisas valiosas.",
    type: "chest",
  },
  epic_chest: {
    image: "/assets/items/chests/epic.svg",
    name: "Baú Épico",
    description: "Um baú energizado. Coisas poderosas o aguardam.",
    type: "chest",
  },
  boss_chest: {
    image: "/assets/items/chests/boss.svg",
    name: "Baú de Chefão",
    description: "Um baú imponente. Apenas os fortes o abrem.",
    type: "chest",
  },
  legendary_chest: {
    image: "/assets/items/chests/legendary.svg",
    name: "Baú Lendário",
    description: "Um baú místico. Dizem que contém itens lendários.",
    type: "chest",
  },
} as const);
