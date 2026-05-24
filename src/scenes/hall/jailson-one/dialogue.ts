import { hallJailsonOneDialogue } from "@/data/maps/hall/jailson/one";
import { hallJailsonFourDialogue } from "@/data/maps/hall/jailson/four";
import { hallJailsonFiveDialogue } from "@/data/maps/hall/jailson/five";
import { hallJailsonSixDialogue } from "@/data/maps/hall/jailson/six";
import { hallJailsonSevenDialogue } from "@/data/maps/hall/jailson/seven";
import { hallJailsonEightDialogue } from "@/data/maps/hall/jailson/eight";
import { hallJailsonNineDialogue } from "@/data/maps/hall/jailson/nine";

import type { QuestId } from "@/data/quests";
import { hasQuest, hasItem } from "../shared/helpers";

export const getJailsonOneDialogue = (
  quests: { id: QuestId }[],
  items: { id: string }[]
) => {
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

  if (
    hasQuest(quests, "give_orange_juice") &&
    hasItem(items, "orange_juice")
  ) {
    return hallJailsonSixDialogue;
  }

  if (
    hasQuest(quests, "create_map") &&
    !hasItem(items, "desired_gear") &&
    !hasItem(items, "jorjao_map")
  ) {
    return hallJailsonSevenDialogue;
  }

  if (
    hasQuest(quests, "create_map") &&
    hasItem(items, "desired_gear")
  ) {
    return hallJailsonEightDialogue;
  }

  if (hasItem(items, "jorjao_map")) {
    return hallJailsonNineDialogue;
  }

  return hallJailsonOneDialogue;
};