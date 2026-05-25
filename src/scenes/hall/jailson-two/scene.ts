import { hallJailsonTwo } from "@/maps/hall/jailsonTwo";
import { getJailsonTwoDialogue } from "./dialogue"
import { getJailsonTwoInitialPosition } from "./position";
import { jailsonTwoEvents } from "./events";
import { jailsonTwoNpcs } from "./npcs"
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { HALL_MUSIC } from "@/scenes/shared/music";
import { jailsonTwoTiles } from "./tiles";


export const jailsonTwoScene: SceneConfig = {
    id: "jailson-two",
    dialogueData: getJailsonTwoDialogue,
    events: jailsonTwoEvents,
    tiles: jailsonTwoTiles,
    map: hallJailsonTwo,
    initialPosition: getJailsonTwoInitialPosition,
    audio: { src: HALL_MUSIC.jailson },
    npcs: jailsonTwoNpcs
};