import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getHellroomTwoInitialPosition } from "./position";
import { hellroomTwoNpcs } from "./npcs";
import { getHellroomTwoDialogue } from "./dialogue";
import { hellroomTwoEvents } from "./events";
import { hellRoomTwo } from "@/maps/hellroom/two";

export const twoScene: SceneConfig = {
    id: "two",
    initialPosition: getHellroomTwoInitialPosition,
    dialogueData: getHellroomTwoDialogue,
    map: hellRoomTwo,
    events: hellroomTwoEvents,
    audio: { src: MUSICS.default },
    npcs: hellroomTwoNpcs,
};