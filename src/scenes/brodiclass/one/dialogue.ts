import { brodiClassDialogue } from "@/data/dialogues/brodiclass/one";
import { brodiClassTwoDialogue } from "@/data/dialogues/brodiclass/two";
import { hasQuest } from "@/scenes/shared/helpers";

export const getBrodiclassOneDialogue = ({
  quests,
}: {
  quests: { id: string }[];
}) => {
  if (hasQuest(quests, "save_ematron")) {
    return brodiClassTwoDialogue;
  }
  return brodiClassDialogue;
};
