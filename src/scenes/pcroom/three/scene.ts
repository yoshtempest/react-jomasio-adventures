import { pcsRoom } from "@/maps/pcRoom/one";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getPcRoomThreeDialogue } from "./dialogue"
import { pcRoomThreeNpcs } from "./npcs";
import { getPcRoomThreeInitialPosition } from "./position";
import { pcRoomThreeEvents } from "./events"


export const pcRoomThreeScene: SceneConfig = {
    id: "three",
    dialogueData: getPcRoomThreeDialogue,
    map: pcsRoom,
    events: pcRoomThreeEvents,
    audio: { src: MUSICS.monkeyCircle },
    npcs: pcRoomThreeNpcs,
    initialPosition: getPcRoomThreeInitialPosition,
};