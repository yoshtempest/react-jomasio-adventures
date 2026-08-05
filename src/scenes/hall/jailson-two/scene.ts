import { hallJailsonTwo } from "@/maps/hall/jailsonTwo";
import { getJailsonTwoDialogue } from "./dialogue";
import { getJailsonTwoInitialPosition } from "./position";
import { jailsonTwoEvents } from "./events";
import { jailsonTwoNpcs } from "./npcs";
import { MUSICS } from "@/scenes/shared/music";
import { jailsonTwoTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/scene/background";

export const jailsonTwoScene: SceneConfig = {
  id: "jailson-two",
  background: sceneBackgrounds.HallJailson,
  scaleFix: 1.4,
  dialogueData: getJailsonTwoDialogue,
  events: jailsonTwoEvents,
  tiles: jailsonTwoTiles,
  map: hallJailsonTwo,
  initialPosition: getJailsonTwoInitialPosition,
  audio: { src: MUSICS.jailson },
  npcs: jailsonTwoNpcs,
};
