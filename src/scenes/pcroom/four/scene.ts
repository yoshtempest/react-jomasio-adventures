import { pcsRoom } from "@/maps/pcRoom/one";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getPcRoomFourDialogue } from "./dialogue"
import { pcRoomFourNpcs } from "./npcs";
import { pcRoomFourEvents } from "./events"


export const pcRoomFourScene: SceneConfig = {
    id: "four",
    dialogueData: getPcRoomFourDialogue,
    map: pcsRoom,
    events: pcRoomFourEvents,
    audio: { src: MUSICS.monkeyCircle },
    npcs: pcRoomFourNpcs,
};