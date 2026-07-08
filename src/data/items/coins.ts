import { createItems } from "@/utils/items/createItem";

export const COINS = createItems({
  kwanzas: {
    image: "/assets/items/coins/kwanzas.svg",
    name: "Kwanzas",
    description: "Moeda comum. Use para comprar itens e melhorias.",
    type: "none",
  },
  hypercoin: {
    image: "/assets/items/coins/hypercoins.svg",
    name: "HyperCoin",
    description: "Moeda premium rara. Use para itens especiais.",
    type: "none",
  },
} as const);
