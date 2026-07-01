import { footballCourtDialogue } from "@/data/dialogues/footballCourt/one";
import { footballCourtTwoDialogue } from "@/data/dialogues/footballCourt/two";
import { hasFlag } from "@/scenes/shared/helpers";

export const getFootballCourtOneDialogue = ({
  flags,
}: {
  quests: { id: string }[];
  flags: FlagId[];
}) => {
  if (hasFlag(flags, "neimito")) {
    return footballCourtTwoDialogue;
  }
  return footballCourtDialogue;
};
