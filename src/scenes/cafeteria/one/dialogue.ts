import { cafeteriaDialogue } from "@/data/dialogues/cafeteria/one";
import { cafeteriaTwoDialogue } from "@/data/dialogues/cafeteria/two";
import { hasFlag } from "@/scenes/shared/helpers";

export const getCafeteriaOneDialogue = ({ flags }: { flags: FlagId[] }) => {
  if (hasFlag(flags, "deise")) {
    return cafeteriaTwoDialogue;
  }
  return cafeteriaDialogue;
};
