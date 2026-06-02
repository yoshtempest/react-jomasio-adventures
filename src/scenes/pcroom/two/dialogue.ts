import { pcsRoomTwoDialogue } from "@/data/maps/pcsRoom/two";
import { pcsRoomThreeDialogue } from "@/data/maps/pcsRoom/three";
import type { FlagId } from "@/data/flags";
import { hasFlag } from "@/scenes/shared/helpers";

export const getPcRoomTwoDialogue = (flags: { id: FlagId }[]) => {
    if (hasFlag(flags, "hungryDeath")) {
        return pcsRoomThreeDialogue;
    }
    return pcsRoomTwoDialogue;
};
