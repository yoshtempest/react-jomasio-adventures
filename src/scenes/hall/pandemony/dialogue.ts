import { HallPandemonyDialogue } from "@/data/maps/hall/pandemony/one";
import { hallHellTwoDialogue } from "@/data/maps/hall/hell/two";

import { hasQuest } from "@/scenes/shared/helpers";

export const getPandemonyDialogue = ({
  quests
}: {
  quests: { id: QuestId }[],
}) => {
    if (hasQuest(quests, "go_to_hell")) {
      return hallHellTwoDialogue;
    }

    return HallPandemonyDialogue;
}