import { createItems } from "@/utils/items/createItem";

export const ENERGETICS = createItems({
  cafe: {
    image: "/assets/items/cafe.svg",
    name: "Café",
    description:
      "Café preto passado na hora. Acorda até os mortos. Recupera 35 de sono e 5 de fome.",
    type: "consumable",
  },
  energetico: {
    image: "/assets/items/energy_drink.svg",
    name: "Energético",
    description:
      "Lata gelada de pura cafeína e taurina. Recupera 50 de sono e 6 de fome.",
    type: "consumable",
  },
  whey_protein: {
    image: "/assets/items/whey_protein.svg",
    name: "Whey Protein",
    description:
      "Shake de proteína do ganho, papaín. Recupera 15 de sono e 20 de fome.",
    type: "consumable",
  },
  creatina: {
    image: "/assets/items/creatina.svg",
    name: "Creatina",
    description:
      "Monohidratada, obviamente. Recupera 10 de sono e 12 de fome.",
    type: "consumable",
  },
  coca_cola: {
    image: "/assets/items/coca_cola.svg",
    name: "Coca-Cola",
    description:
      "Geladinha, daquelas que descem redondo. Recupera 25 de sono e 10 de fome.",
    type: "consumable",
  },
} as const);
