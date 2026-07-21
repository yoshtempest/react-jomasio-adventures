import { createItems } from "@/utils/items/createItem";
import { NPC_CARDS } from "@/data/npc/cards";
import { npcPath } from "@/utils/paths";
import { CLASS_DATA } from "@/data/npc/class";

function cardImage(npcType: string): string {
  return npcPath(`/${npcType}/right.svg`);
}

function cardDescription(card: (typeof NPC_CARDS)[string]): string {
  const classLabel = CLASS_DATA[card.npcClass].label;
  return [
    card.description,
    "",
    `Classe: ${classLabel}`,
    `ATK: ${card.attack}  DEF: ${card.defense}`,
    `Cod: ${card.code}`,
  ].join("\n");
}

const CARD_ITEMS = Object.fromEntries(
  Object.values(NPC_CARDS).map((card) => [
    card.id,
    {
      image: cardImage(card.npcType),
      name: card.name,
      description: cardDescription(card),
      type: "card" as const,
    },
  ]),
);

export const CARDS = createItems(CARD_ITEMS);
