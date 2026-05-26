import { pcsRoomFive } from "@/maps/pcRoom/five";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getPcRoomFiveDialogue } from "./dialogue"
import { pcRoomFiveNpcs } from "./npcs";
import { pcRoomFiveEvents } from "./events"


export const pcRoomFiveScene: SceneConfig = {
    id: "five",
    className: "PcsRoom",
    dialogueData: getPcRoomFiveDialogue,
    map: pcsRoomFive,
    events: pcRoomFiveEvents,
    audio: { src: MUSICS.monkeyCircle },
    npcs: pcRoomFiveNpcs,
};