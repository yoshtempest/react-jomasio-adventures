import { HellRoomDialogue } from "@/data/maps/hellRoom/one";
import { HellRoomTwoDialogue } from "@/data/maps/hellRoom/two";
import { hasItem } from "@/scenes/shared/helpers";

export const getHellroomDialogue = ({ items }: { items: { id: ItemId }[] }) => {
  if (hasItem(items, "turkey")) {
    return HellRoomTwoDialogue;
  }
  return HellRoomDialogue;
};
