import { pcsRoom } from "@/maps/pcRoom/one";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getPcRoomSevenDialogue } from "./dialogue"
import { pcRoomSevenNpcs } from "./npcs";
import { getPcRoomSevenInitialPosition } from "./position";
import { pcRoomSevenTiles } from "./tiles";
import { pcRoomSevenEvents } from "./events"


export const sevenScene: SceneConfig = {
    id: "seven",
    dialogueData: getPcRoomSevenDialogue,
    map: pcsRoom,
    events: pcRoomSevenEvents,
    audio: { src: MUSICS.monkeyCircle },
    npcs: pcRoomSevenNpcs,
    initialPosition: getPcRoomSevenInitialPosition,
    tiles: pcRoomSevenTiles,
};