import { cantinaDialogue } from "@/data/dialogues/cantina/one";
import { cantinaTwoDialogue } from "@/data/dialogues/cantina/two";
import { cantinaThreeDialogue } from "@/data/dialogues/cantina/three";
import { hasFlag, hasQuest } from "@/scenes/shared/helpers";

export const getCantinaOneDialogue = ({
  quests,
  flags,
}: {
  quests: { id: string }[];
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
