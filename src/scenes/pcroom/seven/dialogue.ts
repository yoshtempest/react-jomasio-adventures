import { pcsRoomSevenDialogue } from "@/data/maps/pcsRoom/seven";
import { pcsRoomEightDialogue } from "@/data/maps/pcsRoom/eight";
import { hasFlag } from "@/scenes/shared/helpers";
import type { FlagId } from "@/data/flags";

export const getPcRoomSevenDialogue = ({
  flags
}: {
  flags: FlagId[]
}) => {
  if (hasFlag(flags, "hungryKing")) {
    return pcsRoomEightDialogue;
  }
  return pcsRoomSevenDialogue;
};