import { brodiClass } from "@/maps/brodiClass";
import { MUSICS } from "@/scenes/shared/music";
import { getBrodiClassOneInitialPosition } from "./position";
import { getCantinaOneDialogue } from "./dialogue";
import { cantinaOneNpcs } from "./npcs";
import { brodiClassOneEvents } from "./events";
import { brodiclassOneTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/sceneBackground";

export const oneScene: SceneConfig = {
  id: "one",
  background: sceneBackgrounds.BrodiClass,
  map: brodiClass,
  events: brodiClassOneEvents,
  npcs: cantinaOneNpcs,
  dialogueData: getCantinaOneDialogue,
  audio: { src: MUSICS.ToothlessDancing },
  initialPosition: getBrodiClassOneInitialPosition,
  tiles: brodiclassOneTiles,
};
