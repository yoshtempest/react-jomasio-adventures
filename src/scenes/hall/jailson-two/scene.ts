import { hallJailsonTwo } from "@/maps/hall/jailsonTwo";
import { getJailsonTwoDialogue } from "./dialogue"
import { getJailsonTwoInitialPosition } from "./position";
import { jailsonTwoEvents } from "./events";
import { jailsonTwoNpcs } from "./npcs"
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { MUSICS } from "@/scenes/shared/music";
import { jailsonTwoTiles } from "./tiles";


export const jailsonTwoScene: SceneConfig = {
    id: "jailson-two",
    className: "HallJailson",
    dialogueData: getJailsonTwoDialogue,
    events: jailsonTwoEvents,
    tiles: jailsonTwoTiles,
    map: hallJailsonTwo,
    initialPosition: getJailsonTwoInitialPosition,
    audio: { src: MUSICS.jailson },
    npcs: jailsonTwoNpcs
};