import { cafeteriaDialogue } from "@/data/maps/cafeteria/one";
import { cafeteriaTwoDialogue } from "@/data/maps/cafeteria/two";
import { hasFlag } from "@/scenes/shared/helpers";

export const getCafeteriaOneDialogue = ({ flags }: { flags: FlagId[] }) => {
  if (hasFlag(flags, "deise")) {
    return cafeteriaTwoDialogue;
  }
  return cafeteriaDialogue;
};
