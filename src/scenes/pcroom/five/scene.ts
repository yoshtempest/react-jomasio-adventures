import { pcsRoom } from "@/maps/pcRoom/one";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getPcRoomFiveDialogue } from "./dialogue"
import { pcRoomFiveNpcs } from "./npcs";
import { pcRoomFiveEvents } from "./events"


export const pcRoomFiveScene: SceneConfig = {
    id: "five",
    dialogueData: getPcRoomFiveDialogue,
    map: pcsRoom,
    events: pcRoomFiveEvents,
    audio: { src: MUSICS.monkeyCircle },
    npcs: pcRoomFiveNpcs,
};