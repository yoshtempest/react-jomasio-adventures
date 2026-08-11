import { brodiClass } from "@/maps/brodiClass";
import { MUSICS } from "@/scenes/shared/music";
import { getBrodiClassOneInitialPosition } from "./position";
import { getBrodiclassOneDialogue } from "./dialogue";
import { cantinaOneNpcs } from "./npcs";
import { brodiClassOneEvents } from "./events";
import { brodiclassOneTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/scene/background";

export const oneScene: SceneConfig = {
  id: "one",
  background: sceneBackgrounds.BrodiClass,
  map: brodiClass,
  events: brodiClassOneEvents,
  npcs: cantinaOneNpcs,
  scaleFix: 2,
  dialogueData: getBrodiclassOneDialogue,
  audio: { src: MUSICS.ToothlessDancing },
  initialPosition: getBrodiClassOneInitialPosition,
  tiles: brodiclassOneTiles,
};
