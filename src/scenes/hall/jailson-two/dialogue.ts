import { hallJailsonTwoDialogue } from "@/data/dialogues/hall/jailson/two";
import { hallJailsonThreeDialogue } from "@/data/dialogues/hall/jailson/three";
import { hasFlag } from "@/scenes/shared/helpers";

export const getJailsonTwoDialogue = ({ flags }: { flags: FlagId[] }) => {
  if (hasFlag(flags, "slimita")) {
    return hallJailsonThreeDialogue;
  }

  return hallJailsonTwoDialogue;
};
