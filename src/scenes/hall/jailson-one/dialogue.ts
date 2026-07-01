import { hallJailsonOneDialogue } from "@/data/dialogues/hall/jailson/one";
import { hallJailsonFourDialogue } from "@/data/dialogues/hall/jailson/four";
import { hallJailsonFiveDialogue } from "@/data/dialogues/hall/jailson/five";
import { hallJailsonSixDialogue } from "@/data/dialogues/hall/jailson/six";
import { hallJailsonSevenDialogue } from "@/data/dialogues/hall/jailson/seven";
import { hallJailsonEightDialogue } from "@/data/dialogues/hall/jailson/eight";
import { hallJailsonNineDialogue } from "@/data/dialogues/hall/jailson/nine";

import { hasQuest, hasItem } from "@/scenes/shared/helpers";

export const getJailsonOneDialogue = ({
  quests,
  items,
}: {
  quests: { id: string }[];
  items: { id: ItemId }[];
}) => {
  if (!hasQuest(quests, "give_orange_juice")) {
    return hallJailsonFourDialogue;
  }

  if (
    hasQuest(quests, "give_orange_juice") &&
    !hasItem(items, "orange_juice") &&
    !hasQuest(quests, "create_map")
  ) {
    return hallJailsonFiveDialogue;
  }

  if (hasQuest(quests, "give_orange_juice") && hasItem(items, "orange_juice")) {
    return hallJailsonSixDialogue;
  }

  if (
    hasQuest(quests, "create_map") &&
    !hasItem(items, "desired_gear") &&
    !hasItem(items, "jorjao_map")
  ) {
    return hallJailsonSevenDialogue;
  }

  if (hasQuest(quests, "create_map") && hasItem(items, "desired_gear")) {
    return hallJailsonEightDialogue;
  }

  if (hasItem(items, "jorjao_map")) {
    return hallJailsonNineDialogue;
  }

  return hallJailsonOneDialogue;
};
