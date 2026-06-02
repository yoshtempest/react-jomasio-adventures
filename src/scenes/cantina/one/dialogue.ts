import { cantinaDialogue } from "@/data/maps/cantina/one";
import { cantinaTwoDialogue } from "@/data/maps/cantina/two";
import { cantinaThreeDialogue } from "@/data/maps/cantina/three";
import type { QuestId } from "@/data/quests";
import { hasFlag, hasQuest } from "@/scenes/shared/helpers";

export const getCantinaOneDialogue = (quests: { id: QuestId }[]) => {
    if (hasQuest(quests, "director_escape") && !hasFlag(flags, "jhowsimar_battle_won")) {
        return cantinaTwoDialogue;
    }
    if (hasFlag(flags, "jhowsimar_battle_won")) {
        return cantinaThreeDialogue;
    }
    return cantinaDialogue;
};