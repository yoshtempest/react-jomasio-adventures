import { chestPath } from "@/utils/paths";

import { createItems } from "@/utils/items/createItem";

export const CHESTS = createItems({
  common_chest: {
    image: chestPath("common.svg"),
    name: "Baú Simples",
    description: "Um baú de madeira. Quem sabe o que tem dentro?",
    type: "chest",
  },
  rare_chest: {
    image: chestPath("rare.svg"),
    name: "Baú Raro",
    description: "Um baú prateado. Parece ter coisas valiosas.",
    type: "chest",
  },
  epic_chest: {
    image: chestPath("epic.svg"),
    name: "Baú Épico",
    description: "Um baú energizado. Coisas poderosas o aguardam.",
    type: "chest",
  },
  boss_chest: {
    image: chestPath("boss.svg"),
    name: "Baú de Chefão",
    description: "Um baú imponente. Apenas os fortes o abrem.",
    type: "chest",
  },
  legendary_chest: {
    image: chestPath("legendary.svg"),
    name: "Baú Lendário",
    description: "Um baú místico. Dizem que contém itens lendários.",
    type: "chest",
  },
} as const);

export const CHEST_OPENED_SPRITES: Record<NPCClass, string> = {
  common: chestPath("commomOpened.svg"),
  rare: chestPath("rareOpened.svg"),
  epic: chestPath("epicOpened.svg"),
  boss: chestPath("bossOpened.svg"),
  legendary: chestPath("legendaryOpened.svg"),
  supreme: chestPath("supremeOpened.svg"),
  omega: chestPath("omegaOpened.svg"),
};

/** Registro baú → tier de batalha. Fonte única para derivar tier e chave. */
export const CHEST_TIER_BY_ITEM = {
  common_chest: "common",
  rare_chest: "rare",
  epic_chest: "epic",
  boss_chest: "boss",
  legendary_chest: "legendary",
} as const satisfies Record<keyof typeof CHESTS, NPCClass>;

export type ChestItemId = keyof typeof CHEST_TIER_BY_ITEM;

export function isChestItem(value: ItemId): value is ChestItemId {
  return value in CHEST_TIER_BY_ITEM;
}

export function getKeyIdForChest(chestId: ChestItemId): ItemId {
  return `${CHEST_TIER_BY_ITEM[chestId]}_key` as ItemId;
}

export const DAILY_CHEST_CLOSED_SPRITE = chestPath("default.svg");
export const DAILY_CHEST_OPENED_SPRITE = chestPath("defaultOpened.svg");
