import { cafeteriaDialogue } from "@/data/maps/cafeteria/one";
import { cafeteriaTwoDialogue } from "@/data/maps/cafeteria/two";
import { hasFlag } from "@/scenes/shared/helpers";

export const getCafeteriaOneDialogue = (flags: { id: FlagId }[]) => {
    if (hasFlag(flags, "deise_battle_won")) {
        return cafeteriaTwoDialogue;
    }
    return cafeteriaDialogue;
};