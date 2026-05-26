import { cantina } from "@/maps/cantina/one";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getCantinaOneInitialPosition } from "./position";
import { getCantinaOneDialogue } from "./dialogue";
import { cantinaOneNpcs } from "./npcs";
import { cantinaOneEvents } from "./events"


export const cantinaOneScene: SceneConfig = {
    id: "one",
    className: "Cantina",
    map: cantina,
    events: cantinaOneEvents,
    npcs: cantinaOneNpcs,
    dialogueData: getCantinaOneDialogue,
    audio: { src: MUSICS.default },
    initialPosition: getCantinaOneInitialPosition,
};