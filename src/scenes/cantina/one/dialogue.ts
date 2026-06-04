import { cantinaDialogue } from "@/data/maps/cantina/one";
import { cantinaTwoDialogue } from "@/data/maps/cantina/two";
import { cantinaThreeDialogue } from "@/data/maps/cantina/three";
import type { QuestId } from "@/data/quests";
import { hasFlag, hasQuest } from "@/scenes/shared/helpers";
import type { FlagId } from "@/data/flags";

export const getCantinaOneDialogue = ({
  quests,
  flags,
}: {
  quests: { id: QuestId }[];
  flags: FlagId[];
}) => {
    if (hasQuest(quests, "director_escape") && !hasFlag(flags, "jhowsimar")) {
      return cantinaTwoDialogue;
    }
    if (hasFlag(flags, "jhowsimar")) {
      return cantinaThreeDialogue;
    }
    return cantinaDialogue;
};