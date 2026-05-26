import { cafeteria } from "@/maps/cafeteria/one";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getCafeteriaOneInitialPosition } from "./position";
import { cafeteriaOneTiles } from "./tiles";
import { getCafeteriaOneDialogue } from "./dialogue";
import { cafeteriaOneNpcs } from "./npcs";
import { cafeteriaOneEvents } from "./events"


export const cafeteriaOneScene: SceneConfig = {
    id: "one",
    className: "Cafeteria",
    map: cafeteria,
    events: cafeteriaOneEvents,
    npcs: cafeteriaOneNpcs,
    dialogueData: getCafeteriaOneDialogue,
    audio: { src: MUSICS.default },
    initialPosition: getCafeteriaOneInitialPosition,
    tiles: cafeteriaOneTiles,
};