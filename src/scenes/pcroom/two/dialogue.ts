import { pcsRoomTwoDialogue } from "@/data/maps/pcsRoom/two";
import { pcsRoomThreeDialogue } from "@/data/maps/pcsRoom/three";
import { hasFlag } from "@/scenes/shared/helpers";

export const getPcRoomTwoDialogue = ({ flags }: { flags: FlagId[] }) => {
  if (hasFlag(flags, "hungryDeath")) {
    return pcsRoomThreeDialogue;
  }
  return pcsRoomTwoDialogue;
};
