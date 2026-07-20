import { cantina } from "@/maps/cantina/one";
import { MUSICS } from "@/scenes/shared/music";
import { getBrodiClassTwoInitialPosition } from "./position";
import { getCantinaOneDialogue } from "./dialogue";
import { cantinaOneNpcs } from "./npcs";
import { brodiClassTwoEvents } from "./events";
import { brodiclassTwoTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/scene/background";

export const twoScene: SceneConfig = {
  id: "one",
  background: sceneBackgrounds.BrodiClass,
  map: cantina,
  events: brodiClassTwoEvents,
  npcs: cantinaOneNpcs,
  dialogueData: getCantinaOneDialogue,
  audio: { src: MUSICS.ToothlessDancing },
  initialPosition: getBrodiClassTwoInitialPosition,
  tiles: brodiclassTwoTiles,
};
