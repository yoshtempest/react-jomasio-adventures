import { cafeteriaDialogue } from "@/data/maps/cafeteria/one";
import { cafeteriaTwoDialogue } from "@/data/maps/cafeteria/two";
import type { QuestId } from "@/data/quests";
import { hasQuest } from "@/scenes/shared/helpers";

export const getCafeteriaOneDialogue = (quests: { id: QuestId }[]) => {
    if (hasQuest(quests, "x1_deise")) {
        return cafeteriaTwoDialogue;
    }
    return cafeteriaDialogue;
};