import { hallHellOneDialogue } from "@/data/maps/hall/hell/one";
import { hallHellTwoDialogue } from "@/data/maps/hall/hell/two";

import type { QuestId } from "@/data/quests";
import { hasQuest } from "@/scenes/shared/helpers";

export const getHellDialogue = (
  quests: { id: QuestId }[],
) => {
    if (hasQuest(quests, "go_to_hell")) {
        return hallHellTwoDialogue;
    }

    return hallHellOneDialogue;
}