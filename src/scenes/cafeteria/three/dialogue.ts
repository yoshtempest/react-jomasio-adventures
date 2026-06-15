import { cafeteriaFourDialogue } from "@/data/maps/cafeteria/four";
import { cafeteriaFiveDialogue } from "@/data/maps/cafeteria/five";
import { hasItem } from "@/scenes/shared/helpers";

export const getCafeteriaThreeDialogue = ({
  items,
}: {
  items: { id: ItemId }[];
}) => {
  if (hasItem(items, "sausage")) {
    return cafeteriaFiveDialogue;
  }
  return cafeteriaFourDialogue;
};
