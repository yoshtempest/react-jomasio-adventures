import type {
  EquippedItemInfo,
  EquippedItems,
} from "@/utils/types/player/equipment";
import { ARMOR_SLOTS } from "@/data/equipment/definitions";

export function* eachArmorItem(equipped: EquippedItems): Generator<EquippedItemInfo> {
  for (const slot of ARMOR_SLOTS) {
    const info = equipped[slot];
    if (info) yield info;
  }
  yield* equipped.accessories;
}