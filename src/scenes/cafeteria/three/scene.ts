import { cafeteriaThree } from "@/maps/cafeteria/three";
import { MUSICS } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { getCafeteriaThreeInitialPosition } from "./position";
import { cafeteriaThreeNpcs } from "./npcs";
import { cafeteriaThreeEvents } from "./events";
import { getCafeteriaThreeDialogue } from "./dialogue";

export const threeScene: SceneConfig = {
  id: "three",
  className: "Cafeteria",
  map: cafeteriaThree,
  dialogueData: getCafeteriaThreeDialogue,
  events: cafeteriaThreeEvents,
  audio: { src: MUSICS.default },
  initialPosition: getCafeteriaThreeInitialPosition,
  npcs: cafeteriaThreeNpcs,
};
