import { createItems } from "@/utils/items/createItem";

export const MOUNT = createItems({
  turkey: {
    image: "/assets/items/peru.svg",
    name: "Peru Comprido",
    description:
      "Um peru bem avantajado. O pai do protagonista ficaria orgulhoso.",
    type: "mount",
  },
} as const);
