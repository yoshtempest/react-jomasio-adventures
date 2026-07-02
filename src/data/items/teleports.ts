import { createItems } from "@/utils/items/createItem";

export const TELEPORTS = createItems({
  good_powder: {
    image: "/assets/items/good_powder.svg",
    name: "Pó do bom",
    description: "Um pó brilhante e cheiroso. Dizem que causa alucinações.",
    type: "teleport",
  },
} as const);
