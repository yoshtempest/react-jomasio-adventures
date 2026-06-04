import { hallJailsonTwoDialogue } from "@/data/maps/hall/jailson/two";
import { hallJailsonThreeDialogue } from "@/data/maps/hall/jailson/three";
import { hasFlag } from "@/scenes/shared/helpers";
import type { FlagId } from "@/data/flags";

export const getJailsonTwoDialogue = ({
    flags,
}: {
    flags: FlagId[]
}) => {
    if (hasFlag(flags, "slimita")) {
        return hallJailsonThreeDialogue;
    }

    return hallJailsonTwoDialogue;
}