import type {
  EquippedItems,
  EquippedItemInfo,
} from "@/utils/types/player/equipment";
import { EQUIPMENT_SLOTS } from "@/data/equipment/definitions";

export function* eachEquippedItem(
  equipped: EquippedItems,
): Generator<EquippedItemInfo> {
  for (const slot of EQUIPMENT_SLOTS) {
    const info = equipped[slot];
    if (info) yield info;
  }
  yield* equipped.accessories;
}