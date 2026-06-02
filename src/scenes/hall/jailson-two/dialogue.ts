import { hallJailsonTwoDialogue } from "@/data/maps/hall/jailson/two";
import { hallJailsonThreeDialogue } from "@/data/maps/hall/jailson/three";
import type { FlagId } from "@/data/flags";
import { hasFlag } from "@/scenes/shared/helpers";

export const getJailsonTwoDialogue = ( flags: { id: FlagId }[] ) => {
    if (hasFlag(flags, "slimita")) {
        return hallJailsonThreeDialogue;
    }

    return hallJailsonTwoDialogue;
}