import { pcsRoomSevenDialogue } from "@/data/maps/pcsRoom/seven";
import { pcsRoomEightDialogue } from "@/data/maps/pcsRoom/eight";
import { hasFlag } from "@/scenes/shared/helpers";

export const getPcRoomSevenDialogue = () => {
  if (hasFlag(flags, "hungryking_battle_won")) {
      return pcsRoomEightDialogue;
  }
  return pcsRoomSevenDialogue;
};