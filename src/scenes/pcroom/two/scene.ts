import { pcsRoomTwo } from "@/maps/pcRoom/two";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getPcRoomTwoDialogue } from "./dialogue"
import { pcRoomTwoNpcs } from "./npcs";
import { pcRoomTwoEvents } from "./events"


export const pcRoomTwoScene: SceneConfig = {
    id: "two",
    className: "PcsRoom",
    dialogueData: getPcRoomTwoDialogue,
    map: pcsRoomTwo,
    events: pcRoomTwoEvents,
    audio: { src: MUSICS.monkeyCircle },
    npcs: pcRoomTwoNpcs,
};