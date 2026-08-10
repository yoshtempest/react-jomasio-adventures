import { HellRoomDialogue } from "@/data/dialogues/hellRoom/one";
import { HellRoomTwoDialogue } from "@/data/dialogues/hellRoom/two";
import { hasFlag } from "@/scenes/shared/helpers";

export const getHellroomDialogue = ({ flags }: { flags: FlagId[] }) => {
  if (hasFlag(flags, "chose_peru")) {
    return HellRoomTwoDialogue;
  }
  return HellRoomDialogue;
};
