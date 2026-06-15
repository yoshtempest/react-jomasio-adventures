import { footballCourtDialogue } from "@/data/maps/footballCourt/one";
import { footballCourtTwoDialogue } from "@/data/maps/footballCourt/two";
import { hasFlag } from "@/scenes/shared/helpers";

export const getFootballCourtOneDialogue = ({
  flags,
}: {
  quests: { id: QuestId }[];
  flags: FlagId[];
}) => {
  if (hasFlag(flags, "neimito")) {
    return footballCourtTwoDialogue;
  }
  return footballCourtDialogue;
};
