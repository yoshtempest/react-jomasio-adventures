import { cafeteriaFour } from "@/maps/cafeteria/four";
import { MUSICS } from "@/scenes/shared/music";
import { getCafeteriaFourInitialPosition } from "./position";
import { cafeteriaFourTiles } from "./tiles";

export const fourScene: SceneConfig = {
  id: "four",
  className: "Cafeteria",
  map: cafeteriaFour,
  audio: { src: MUSICS.default },
  initialPosition: getCafeteriaFourInitialPosition,
  tiles: cafeteriaFourTiles,
};
