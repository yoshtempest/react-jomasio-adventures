import { pcsRoomSevenDialogue } from "@/data/maps/pcsRoom/seven";
import { pcsRoomEightDialogue } from "@/data/maps/pcsRoom/eight";
import type { FlagId } from "@/data/flags";
import { hasFlag } from "@/scenes/shared/helpers";

export const getPcRoomSevenDialogue = ( flags: { id: FlagId }[] ) => {
  if (hasFlag(flags, "hungryKing")) {
      return pcsRoomEightDialogue;
  }
  return pcsRoomSevenDialogue;
};