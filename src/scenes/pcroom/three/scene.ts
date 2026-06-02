import { pcsRoomThree } from "@/maps/pcRoom/three";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getPcRoomThreeDialogue } from "./dialogue"
import { pcRoomThreeNpcs } from "./npcs";
import { getPcRoomThreeInitialPosition } from "./position";
import { pcRoomThreeEvents } from "./events"


export const threeScene: SceneConfig = {
    id: "three",
    dialogueData: getPcRoomThreeDialogue,
    map: pcsRoomThree,
    events: pcRoomThreeEvents,
    audio: { src: MUSICS.monkeyCircle },
    npcs: pcRoomThreeNpcs,
    initialPosition: getPcRoomThreeInitialPosition,
};