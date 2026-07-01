import { pcsRoomSevenDialogue } from "@/data/dialogues/pcsRoom/seven";
import { pcsRoomEightDialogue } from "@/data/dialogues/pcsRoom/eight";
import { hasFlag } from "@/scenes/shared/helpers";

export const getPcRoomSevenDialogue = ({ flags }: { flags: FlagId[] }) => {
  if (hasFlag(flags, "hungryKing")) {
    return pcsRoomEightDialogue;
  }
  return pcsRoomSevenDialogue;
};
