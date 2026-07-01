import { hallHellOneDialogue } from "@/data/dialogues/hall/hell/one";
import { hallHellTwoDialogue } from "@/data/dialogues/hall/hell/two";

import { hasQuest } from "@/scenes/shared/helpers";

export const getHellDialogue = ({ quests }: { quests: { id: string }[] }) => {
  if (hasQuest(quests, "go_to_hell")) {
    return hallHellTwoDialogue;
  }

  return hallHellOneDialogue;
};
