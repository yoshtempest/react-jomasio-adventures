import { hallOne } from "@/maps/hall/one";
import { getHallOneInitialPosition } from "@/scenes/hall/one/position";
import { HALL_MUSIC } from "@/scenes/shared/music";
import type { SceneConfig } from "@/utils/types/maps/sceneConfig";
import { hallOneTiles } from "./tiles";


export const oneScene: SceneConfig = {
  id: "one",
  className: "HallOne",
  initialPosition: getHallOneInitialPosition,
  map: hallOne,
  audio: { src: HALL_MUSIC.default },
  tiles: hallOneTiles,
};