import { pcsRoomTwoDialogue } from "@/data/maps/pcsRoom/two";
import { pcsRoomThreeDialogue } from "@/data/maps/pcsRoom/three";
import type { QuestId } from "@/data/quests";
import { hasQuest } from "@/scenes/shared/helpers";

export const getPcRoomTwoDialogue = (quests: { id: QuestId }[]) => {
    if (hasQuest(quests, "x1_hungry")) {
        return pcsRoomThreeDialogue;
    }
    return pcsRoomTwoDialogue;
};
