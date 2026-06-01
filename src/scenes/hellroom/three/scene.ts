import { director } from "@/maps/director";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getHellroomThreeInitialPosition } from "./position";
import { hellroomThreeNpcs } from "./npcs";
import { getHellroomThreeDialogue } from "./dialogue";
import { hellroomThreeEvents } from "./events";

export const threeScene: SceneConfig = {
    id: "three",
    initialPosition: getHellroomThreeInitialPosition,
    dialogueData: getHellroomThreeDialogue,
    map: director,
    events: hellroomThreeEvents,
    audio: { src: MUSICS.default },
    npcs: hellroomThreeNpcs,
};