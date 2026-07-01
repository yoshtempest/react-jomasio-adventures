import { HellRoomDialogue } from "@/data/dialogues/hellRoom/one";
import { HellRoomTwoDialogue } from "@/data/dialogues/hellRoom/two";
import { hasItem } from "@/scenes/shared/helpers";

export const getHellroomDialogue = ({ items }: { items: { id: ItemId }[] }) => {
  if (hasItem(items, "turkey")) {
    return HellRoomTwoDialogue;
  }
  return HellRoomDialogue;
};
