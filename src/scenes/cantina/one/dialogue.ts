import { cantinaDialogue } from "@/data/maps/cantina/one";
import { cantinaTwoDialogue } from "@/data/maps/cantina/two";
import { cantinaThreeDialogue } from "@/data/maps/cantina/three";
import type { QuestId } from "@/data/quests";
import { hasQuest } from "@/scenes/shared/helpers";

export const getCantinaOneDialogue = (quests: { id: QuestId }[]) => {
    if (hasQuest(quests, "director_escape") && !hasQuest(quests, "x1_jhowsimar")) {
        return cantinaTwoDialogue;
    }
    if (hasQuest(quests, "x1_jhowsimar")) {
        return cantinaThreeDialogue;
    }
    return cantinaDialogue;
};