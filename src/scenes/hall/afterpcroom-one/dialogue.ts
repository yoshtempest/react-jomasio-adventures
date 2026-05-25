import { AfterPcRoomOneDialogue } from "@/data/maps/hall/one/one";
import { AfterPcRoomTwoDialogue } from "@/data/maps/hall/one/two";
import { AfterPcRoomThreeDialogue } from "@/data/maps/hall/one/three";
import { AfterPcRoomFourDialogue } from "@/data/maps/hall/one/four";
import { AfterPcRoomFiveDialogue } from "@/data/maps/hall/one/five";
import { AfterPcRoomSixDialogue } from "@/data/maps/hall/one/six";

import type { QuestId } from "@/data/quests";
import { hasQuest, hasItem } from "@/scenes//shared/helpers";


export const getAfterPcRoomOneDialogue = (
  quests: { id: QuestId }[],
  items: { id: string }[]
) => {
    if (hasItem(items, "aura_letter") && !hasQuest(quests, "search_packaging")) {
        return AfterPcRoomOneDialogue;
    }

    if (hasItem(items, "package_01") && !hasItem(items, "good_powder")) {
        return AfterPcRoomThreeDialogue;
    }

    if (hasQuest(quests, "search_packaging") && !hasQuest(quests, "go_cafeteria")) {
        return AfterPcRoomTwoDialogue;
    }

    if (hasQuest(quests, "go_cafeteria") && !hasQuest(quests, "return_to_remedinha")) {
        return AfterPcRoomFiveDialogue;
    }

    if (hasQuest(quests, "return_to_remedinha") || hasQuest(quests, "encounter_deise")) {
        return AfterPcRoomSixDialogue;
    }

    return AfterPcRoomFourDialogue;
}