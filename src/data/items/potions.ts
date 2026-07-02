import { createItems } from "@/utils/items/createItem";

export const POTIONS = createItems({
  xp_potion_common: {
    image: "/assets/items/xp_potion_common.svg",
    name: "Danonão Comum",
    description: "Multiplica o XP ganho em 1.5x por 5 minutos.",
    type: "consumable",
  },
  xp_potion_rare: {
    image: "/assets/items/xp_potion_rare.svg",
    name: "Danonão Raro",
    description: "Multiplica o XP ganho em 1.75x por 10 minutos.",
    type: "consumable",
  },
  xp_potion_epic: {
    image: "/assets/items/xp_potion_epic.svg",
    name: "Danonão Normal",
    description: "Multiplica o XP ganho em 2x por 15 minutos.",
    type: "consumable",
  },
  xp_potion_boss: {
    image: "/assets/items/xp_potion_boss.svg",
    name: "Danonão Forte",
    description: "Multiplica o XP ganho em 2.5x por 20 minutos.",
    type: "consumable",
  },
  xp_potion_legendary: {
    image: "/assets/items/xp_potion_legendary.svg",
    name: "Danonão Grosso",
    description: "Multiplica o XP ganho em 3x por 30 minutos.",
    type: "consumable",
  },
} as const);
