import { cafeteriaFour } from "@/maps/cafeteria/four";
import { MUSICS } from "@/scenes/shared/music";
import { getCafeteriaFourInitialPosition } from "./position";
import { cafeteriaFourTiles } from "./tiles";
import { sceneBackgrounds } from "@/data/scene/background";

export const fourScene: SceneConfig = {
  id: "four",
  background: sceneBackgrounds.Cafeteria,
  map: cafeteriaFour,
  audio: { src: MUSICS.default },
  initialPosition: getCafeteriaFourInitialPosition,
  tiles: cafeteriaFourTiles,
};
