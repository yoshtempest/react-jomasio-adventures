import { createItems } from "@/utils/items/createItem";
import { NPC_CARDS } from "@/data/npc/cards";
import { npcPath } from "@/utils/paths";
import { CLASS_DATA } from "@/data/npc/class";

function cardImage(npcType: string): string {
  return npcPath(`/${npcType}/right.svg`);
}

function cardDescription(card: (typeof NPC_CARDS)[string]): string {
  const classLabel = CLASS_DATA[card.npcClass].label;
  const lines = [
    card.description,
    "",
    `Classe: ${classLabel}`,
    `ATK: ${card.attack}  DEF: ${card.defense}`,
    `Cod: ${card.code}`,
  ];

  const reward = card.reward;
  const rewardLines: string[] = [];

  if (reward.coins) rewardLines.push(`Kwanzas: +${reward.coins}`);
  if (reward.hyperCoins) rewardLines.push(`HyperCoins: +${reward.hyperCoins}`);

  if (reward.stats) {
    const statNames: Record<string, string> = {
      hp: "HP",
      strength: "Força",
      intelligence: "Inteligência",
      resistance: "Resistência",
      tenacity: "Tenacidade",
      luck: "Sorte",
    };
    for (const [key, val] of Object.entries(reward.stats)) {
      if (val) rewardLines.push(`${statNames[key] ?? key}: +${val}`);
    }
  }

  if (reward.characterUnlock) {
    rewardLines.push(`Desbloqueio: ${reward.characterUnlock}`);
  }

  if (rewardLines.length > 0) {
    lines.push("", "Recompensas:", ...rewardLines);
  }

  return lines.join("\n");
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
