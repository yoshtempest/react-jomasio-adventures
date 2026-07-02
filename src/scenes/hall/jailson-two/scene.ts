import { hallJailsonTwo } from "@/maps/hall/jailsonTwo";
import { getJailsonTwoDialogue } from "./dialogue";
import { getJailsonTwoInitialPosition } from "./position";
import { jailsonTwoEvents } from "./events";
import { jailsonTwoNpcs } from "./npcs";
import { MUSICS } from "@/scenes/shared/music";
import { jailsonTwoTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/sceneBackground";

export const jailsonTwoScene: SceneConfig = {
  id: "jailson-two",
  background: sceneBackgrounds.HallJailson,
  dialogueData: getJailsonTwoDialogue,
  events: jailsonTwoEvents,
  tiles: jailsonTwoTiles,
  map: hallJailsonTwo,
  initialPosition: getJailsonTwoInitialPosition,
  audio: { src: MUSICS.jailson },
  npcs: jailsonTwoNpcs,
};
