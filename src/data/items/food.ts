import { createItems } from "@/utils/items/createItem";

export const FOODS = createItems({
  queijo_cabra: {
    image: "/assets/items/goat_cheese.svg",
    name: "Queijo de Cabra",
    description:
      "Queijo curado de cabra. Nutritivo e saboroso. Recupera 30 de fome.",
    type: "food",
  },
  porcao_arroz: {
    image: "/assets/items/rice.svg",
    name: "Porção de Arroz",
    description: "Arroz fresquinho. Enche a barriga. Recupera 20 de fome.",
    type: "food",
  },
  ovo_piupiu: {
    image: "/assets/items/piupiu_egg.svg",
    name: "Ovo de Piupiu",
    description:
      "Ovo misterioso de Piupiu. Frito ou cozido? Recupera 25 de fome.",
    type: "food",
  },
  goat_meat: {
    image: "/assets/items/goat_meat.svg",
    name: "Carne de bode",
    description: "Denovo isso? Todo dia isso mano.",
    type: "food",
  },
} as const);
