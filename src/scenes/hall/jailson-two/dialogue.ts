import { hallJailsonTwoDialogue } from "@/data/maps/hall/jailson/two";
import { hallJailsonThreeDialogue } from "@/data/maps/hall/jailson/three";

import type { QuestId } from "@/data/quests";
import { hasQuest } from "@/scenes/shared/helpers";

export const getJailsonTwoDialogue = (
  quests: { id: QuestId }[],
) => {
    if (hasQuest(quests, "x1_slimita")) {
        return hallJailsonThreeDialogue;
    }

    return hallJailsonTwoDialogue;
}