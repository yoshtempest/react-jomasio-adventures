import { hallHellOneDialogue } from "@/data/maps/hall/hell/one";
import { hallHellTwoDialogue } from "@/data/maps/hall/hell/two";

import { hasQuest } from "@/scenes/shared/helpers";

export const getHellDialogue = ({ quests }: { quests: { id: string }[] }) => {
  if (hasQuest(quests, "go_to_hell")) {
    return hallHellTwoDialogue;
  }

  return hallHellOneDialogue;
};
