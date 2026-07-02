import { createItems } from "@/utils/items/createItem";

export const MAPS = createItems({
  jorjao_map: {
    image: "/assets/items/jorjao_map.svg",
    name: "Mapa Escolar",
    description: "Um mapa do Jorjão. Use para se localizar.",
    type: "map",
  },
} as const);
