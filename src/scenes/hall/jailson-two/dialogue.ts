import { hallJailsonTwoDialogue } from "@/data/maps/hall/jailson/two";
import { hallJailsonThreeDialogue } from "@/data/maps/hall/jailson/three";

import { hasFlag } from "@/scenes/shared/helpers";

export const getJailsonTwoDialogue = ( flags: { id: FlagId }[] ) => {
    if (hasFlag(flags, "slimita_battle_won")) {
        return hallJailsonThreeDialogue;
    }

    return hallJailsonTwoDialogue;
}