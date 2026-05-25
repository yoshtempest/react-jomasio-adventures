import { hallThirdClass } from "@/maps/hall/thirdClass";
import { HALL_MUSIC } from "@/scenes/shared/music";
import { getThirdClassInitialPosition } from "./position";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { hallThirdClassTiles } from "./tiles";

export const thirdClassScene: SceneConfig = {
  id: "thirdclass",
  className: "HallThirdClass",
  initialPosition: getThirdClassInitialPosition,
  map: hallThirdClass,
  audio: { src: HALL_MUSIC.default },
  tiles: hallThirdClassTiles,
};