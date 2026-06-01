import { director } from "@/maps/director";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getHellroomTwoInitialPosition } from "./position";
import { hellroomTwoNpcs } from "./npcs";
import { getHellroomTwoDialogue } from "./dialogue";
import { hellroomTwoEvents } from "./events";

export const twoScene: SceneConfig = {
    id: "two",
    initialPosition: getHellroomTwoInitialPosition,
    dialogueData: getHellroomTwoDialogue,
    map: director,
    events: hellroomTwoEvents,
    audio: { src: MUSICS.default },
    npcs: hellroomTwoNpcs,
};