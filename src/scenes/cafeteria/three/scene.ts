import { cafeteriaThree } from "@/maps/cafeteria/three";
import { MUSICS } from "@/scenes/shared/music";
import { getCafeteriaThreeInitialPosition } from "./position";
import { cafeteriaThreeNpcs } from "./npcs";
import { cafeteriaThreeEvents } from "./events";
import { getCafeteriaThreeDialogue } from "./dialogue";
import { sceneBackgrounds } from "@/data/scene/background";

export const threeScene: SceneConfig = {
  id: "three",
  background: sceneBackgrounds.Cafeteria,
  map: cafeteriaThree,
  dialogueData: getCafeteriaThreeDialogue,
  events: cafeteriaThreeEvents,
  audio: { src: MUSICS.default },
  initialPosition: getCafeteriaThreeInitialPosition,
  npcs: cafeteriaThreeNpcs,
};
