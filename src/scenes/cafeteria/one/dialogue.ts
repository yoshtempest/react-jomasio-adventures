import { cafeteriaDialogue } from "@/data/maps/cafeteria/one";
import { cafeteriaTwoDialogue } from "@/data/maps/cafeteria/two";
import type { FlagId } from "@/data/flags";
import { hasFlag } from "@/scenes/shared/helpers";

export const getCafeteriaOneDialogue = (flags: { id: FlagId }[]) => {
    if (hasFlag(flags, "deise")) {
        return cafeteriaTwoDialogue;
    }
    return cafeteriaDialogue;
};