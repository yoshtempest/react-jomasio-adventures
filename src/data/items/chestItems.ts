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

export const CHEST_OPENED_SPRITES: Record<NPCClass, string> = {
  common: "/assets/items/chests/commomOpened.svg",
  rare: "/assets/items/chests/rareOpened.svg",
  epic: "/assets/items/chests/epicOpened.svg",
  boss: "/assets/items/chests/bossOpened.svg",
  legendary: "/assets/items/chests/legendaryOpened.svg",
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

export const DAILY_CHEST_CLOSED_SPRITE = "/assets/items/chests/default.svg";
export const DAILY_CHEST_OPENED_SPRITE =
  "/assets/items/chests/defaultOpened.svg";
