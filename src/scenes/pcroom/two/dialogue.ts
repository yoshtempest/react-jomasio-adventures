import { pcsRoomTwoDialogue } from "@/data/dialogues/pcsRoom/two";
import { pcsRoomThreeDialogue } from "@/data/dialogues/pcsRoom/three";
import { hasFlag } from "@/scenes/shared/helpers";

export const getPcRoomTwoDialogue = ({ flags }: { flags: FlagId[] }) => {
  if (hasFlag(flags, "hungryDeath")) {
    return pcsRoomThreeDialogue;
  }
  return pcsRoomTwoDialogue;
};
